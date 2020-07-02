import os
import gpxpy
from flask import jsonify, request, url_for, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.api import bp
from app.models import User, GPXFile, Track, gpxfile_schema, track_schema
from app.errors.handlers import error_response
from werkzeug.utils import secure_filename


@bp.route("/users/<int:user_id>/gpxfiles", methods=["GET"])
def get_user_gpxfiles(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(gpxfile_schema.dump(user.gpxfiles.all(), many=True))


@bp.route("/users/<int:user_id>/gpxfiles/<int:gpxfile_id>", methods=["GET"])
def get_user_gpxfile(user_id, gpxfile_id):
    user = User.query.get_or_404(user_id)
    gpxfile = user.gpxfiles.filter_by(id=gpxfile_id).first_or_404()
    return jsonify(gpxfile_schema.dump(gpxfile))


@bp.route("/users/<int:user_id>/gpxfiles", methods=["POST"])
def upload_user_gpxfile(user_id):
    if "file" not in request.files:
        return error_response(400, "GPX file missing.")
    user = User.query.get_or_404(user_id)
    try:
        gpxfile = import_gpxfile(user, request.files["file"])
    except Exception as err:
        return error_response(400, "Unable to import uploaded GPX file.")
    response = jsonify(gpxfile_schema.dump(gpxfile))
    response.status_code = 201
    response.headers["Location"] = url_for("api.get_user_gpxfile", user_id=user.id, gpxfile_id=gpxfile.id)
    return response


def import_gpxfile(user, file):
    gpx = gpxpy.parse(file)
    gpxfile = GPXFile(owner=user, filename=file.filename)
    db.session.add(gpxfile)
    db.session.commit()
    try:
        for gpx_track in gpx.tracks:
            import_track(gpxfile, gpx_track)
        save_uploaded_gpxfile(gpxfile, file)
        db.session.commit()
    except Exception as err:
        db.session.rollback()
        db.session.delete(gpxfile)
        db.session.commit()
        raise err
    return gpxfile


def import_track(gpxfile, gpx_track):
    start_time, end_time = gpx_track.get_time_bounds()
    moving_data = gpx_track.get_moving_data()
    uphill, downhill = gpx_track.get_uphill_downhill()
    track = Track(
        owner=gpxfile.owner,
        file=gpxfile,
        title=gpx_track.name if gpx_track.name else gpxfile.filename,
        time_start=start_time,
        time_end=end_time,
        length2d=gpx_track.length_2d(),
        length3d=gpx_track.length_3d(),
        max_speed=speed_to_kph(moving_data.max_speed),
        avg_speed=speed_to_kph(moving_data.moving_distance / moving_data.moving_time) if moving_data.moving_time > 0.0 else 0.0,
        moving_time=moving_data.moving_time,
        stopped_time=moving_data.stopped_time,
        total_uphill=uphill,
        total_downhill=downhill,
    )
    db.session.add(track)


def save_uploaded_gpxfile(gpxfile, file):
    file.seek(0)
    file.save(os.path.join(current_app.config["GPXFILES_FOLDER"], "{}.gpx".format(gpxfile.id)))


def speed_to_kph(mps):
    return mps * 3.6
