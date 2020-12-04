import os
from uuid import uuid4

import gpxpy
from flask import current_app, jsonify, request, send_from_directory, url_for

from app import db
from app.api import bp
from app.auth.decorators import jwt_and_matching_user_id_required
from app.errors.handlers import error_response
from app.models import ActivityMode, GPXFile, Track, User
from app.schemas import gpxfile_schema
from app.thumbnails.thumbnails import create_thumbnail


@bp.route("/users/<int:user_id>/gpxfiles", methods=["GET"])
@jwt_and_matching_user_id_required
def get_user_gpxfiles(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(gpxfile_schema.dump(user.gpxfiles.all(), many=True))


@bp.route("/users/<int:user_id>/gpxfiles/<int:gpxfile_id>", methods=["GET"])
@jwt_and_matching_user_id_required
def get_user_gpxfile(user_id, gpxfile_id):
    user = User.query.get_or_404(user_id)
    gpxfile = user.gpxfiles.filter_by(id=gpxfile_id).first_or_404()
    return jsonify(gpxfile_schema.dump(gpxfile))


@bp.route("/users/<int:user_id>/gpxfiles", methods=["POST"])
@jwt_and_matching_user_id_required
def upload_user_gpxfile(user_id):
    if "file" not in request.files:
        return error_response(400, "GPX file missing.")
    user = User.query.get_or_404(user_id)
    try:
        gpxfile = import_gpxfile(user, request.files["file"])
    except Exception:
        return error_response(400, "Unable to import uploaded GPX file.")
    response = jsonify(gpxfile_schema.dump(gpxfile))
    response.status_code = 201
    response.headers["Location"] = url_for("api.get_user_gpxfile", user_id=user.id, gpxfile_id=gpxfile.id)
    return response


@bp.route("/users/<int:user_id>/gpxfiles/<int:gpxfile_id>", methods=["DELETE"])
@jwt_and_matching_user_id_required
def delete_user_gpxfile(user_id, gpxfile_id):
    user = User.query.get_or_404(user_id)
    gpxfile = user.gpxfiles.filter_by(id=gpxfile_id).first_or_404()
    db.session.delete(gpxfile)
    db.session.commit()
    return "", 204


@bp.route("/users/<int:user_id>/gpxfiles/<int:gpxfile_id>/download/<filename>", methods=["GET"])
@jwt_and_matching_user_id_required
def download_user_gpxfile(user_id, gpxfile_id, filename):
    user = User.query.get_or_404(user_id)
    gpxfile = user.gpxfiles.filter_by(id=gpxfile_id).first_or_404()
    return send_from_directory(current_app.config["GPXFILES_FOLDER"], "{}.gpx".format(gpxfile.id), mimetype="application/gpx+xml")


def import_gpxfile(user, file):
    gpx = gpxpy.parse(file)
    gpxfile = GPXFile(owner=user, filename=file.filename)
    db.session.add(gpxfile)
    db.session.commit()
    try:
        for gpxfile_track_id, gpx_track in enumerate(gpx.tracks):
            track = import_track(gpxfile, gpx_track, gpxfile_track_id)
            create_thumbnail(track, gpx_track)
        save_uploaded_gpxfile(gpxfile, file)
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        db.session.delete(gpxfile)
        db.session.commit()
        raise err
    return gpxfile


def import_track(gpxfile, gpx_track, gpxfile_track_id):
    start_time, end_time = gpx_track.get_time_bounds()
    moving_data = gpx_track.get_moving_data()
    uphill, downhill = gpx_track.get_uphill_downhill()
    avg_speed = speed_to_kph(moving_data.moving_distance / moving_data.moving_time) if moving_data.moving_time > 0.0 else 0.0
    track = Track(
        owner=gpxfile.owner,
        file=gpxfile,
        gpxfile_track_id=gpxfile_track_id,
        title=gpx_track.name if gpx_track.name else gpxfile.filename,
        time_start=start_time,
        time_end=end_time,
        length2d=gpx_track.length_2d(),
        length3d=gpx_track.length_3d(),
        max_speed=speed_to_kph(moving_data.max_speed),
        avg_speed=avg_speed,
        moving_time=moving_data.moving_time,
        stopped_time=moving_data.stopped_time,
        total_uphill=uphill,
        total_downhill=downhill,
        activity_mode=determine_default_activity_mode(avg_speed),
        thumbnail=str(uuid4()),
    )
    db.session.add(track)
    return track


def save_uploaded_gpxfile(gpxfile, file):
    file.seek(0)
    file.save(os.path.join(current_app.config["GPXFILES_FOLDER"], "{}.gpx".format(gpxfile.id)))


def speed_to_kph(mps):
    return mps * 3.6


def determine_default_activity_mode(avg_speed):
    if avg_speed > 0.0 and avg_speed <= 5.0:
        return ActivityMode.HIKING.value
    else:
        return ActivityMode.BIKE.value
