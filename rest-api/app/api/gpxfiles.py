import os
import gpxpy
import numpy as np
from flask import jsonify, request, url_for, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.api import bp
from app.models import User, GPXFile, Track
from app.models import ActivityMode
from app.schemas import gpxfile_schema, track_schema
from app.auth.decorators import jwt_and_matching_user_id_required
from app.errors.handlers import error_response
from werkzeug.utils import secure_filename
from matplotlib.figure import Figure
from matplotlib.image import imsave
from matplotlib.backends.backend_agg import FigureCanvasAgg
from uuid import uuid4


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
    except Exception as err:
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


def create_thumbnail(track, gpx_track):
    content = generate_thumbnail_content(gpx_track)
    imsave(track.thumbnail_path(), arr=content, format="png")


def generate_thumbnail_content(gpx_track):
    fig = Figure(figsize=(1, 1), dpi=128, facecolor="white", linewidth=2, tight_layout=True)
    canvas = FigureCanvasAgg(fig)
    ax = fig.add_subplot(aspect="equal")
    ax.set_axis_off()

    for segment in gpx_track.segments:
        lat = []
        long = []
        for point in segment.points:
            lat.append(point.latitude)
            long.append(point.longitude)
        ax.plot(long, lat, color="blue")

    canvas.draw()
    return np.asarray(canvas.buffer_rgba())
