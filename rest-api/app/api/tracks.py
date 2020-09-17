import gpxpy
from flask import jsonify, request
from marshmallow import ValidationError

from app import db
from app.api import bp
from app.auth.decorators import jwt_and_matching_user_id_required
from app.errors.handlers import error_response
from app.models import User
from app.schemas import track_schema, track_update_schema


@bp.route("/users/<int:user_id>/tracks", methods=["GET"])
@jwt_and_matching_user_id_required
def get_user_tracks(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(track_schema.dump(user.tracks.all(), many=True))


@bp.route("/users/<int:user_id>/tracks/<int:track_id>", methods=["GET"])
@jwt_and_matching_user_id_required
def get_user_track(user_id, track_id):
    user = User.query.get_or_404(user_id)
    track = user.tracks.filter_by(id=track_id).first_or_404()
    return jsonify(track_schema.dump(track))


@bp.route("/users/<int:user_id>/tracks/<int:track_id>", methods=["DELETE"])
@jwt_and_matching_user_id_required
def delete_user_track(user_id, track_id):
    user = User.query.get_or_404(user_id)
    track = user.tracks.filter_by(id=track_id).first_or_404()
    db.session.delete(track)
    # automatically delete GPX file if all of its tracks have been deleted
    gpxfile = track.file
    if len(gpxfile.tracks.all()) == 0:
        db.session.delete(gpxfile)
    db.session.commit()
    return "", 204


@bp.route("/users/<int:user_id>/tracks/<int:track_id>", methods=["PUT"])
@jwt_and_matching_user_id_required
def update_user_track(user_id, track_id):
    try:
        data = track_update_schema.loads(request.data)
    except ValidationError as error:
        return error_response(400, error.messages)
    user = User.query.get_or_404(user_id)
    track = user.tracks.filter_by(id=track_id).first_or_404()
    track.activity_mode = data["activity_mode"]
    track.title = data["title"]
    db.session.add(track)
    db.session.commit()
    return jsonify(track_schema.dump(track))


@bp.route("/users/<int:user_id>/tracks/<int:track_id>/segments", methods=["GET"])
@jwt_and_matching_user_id_required
def get_user_track_segments(user_id, track_id):
    user = User.query.get_or_404(user_id)
    track = user.tracks.filter_by(id=track_id).first_or_404()
    gpxfile = user.gpxfiles.filter_by(id=track.gpxfile_id).first_or_404()
    segments = load_track_segments(gpxfile, track)
    return jsonify(segments)


def load_track_segments(gpxfile, track):
    with open(gpxfile.static_file_path()) as fp:
        segments = []
        gpx = gpxpy.parse(fp)
        for segment in gpx.tracks[track.gpxfile_track_id].segments:
            points = []
            for point in segment.points:
                points.append([point.latitude, point.longitude])
            segments.append(points)
        return segments
