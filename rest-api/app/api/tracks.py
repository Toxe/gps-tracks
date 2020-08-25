import gpxpy
from flask import jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.api import bp
from app.models import User, GPXFile, Track
from app.schemas import track_schema
from app.auth.decorators import jwt_and_matching_user_id_required
from app.errors.handlers import error_response


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
    db.session.commit()
    return "", 204


@bp.route("/users/<int:user_id>/tracks/<int:track_id>/segments", methods=["GET"])
@jwt_and_matching_user_id_required
def get_user_track_segments(user_id, track_id):
    user = User.query.get_or_404(user_id)
    track = user.tracks.filter_by(id=track_id).first_or_404()
    gpxfile = user.gpxfiles.filter_by(id=track.gpxfile_id).first_or_404()
    segments = load_track_segments(gpxfile, track)
    return jsonify(segments)


@bp.route("/users/<int:user_id>/tracks/<int:track_id>/thumbnail.png", methods=["GET"])
@jwt_and_matching_user_id_required
def get_user_track_thumbnail(user_id, track_id):
    user = User.query.get_or_404(user_id)
    track = user.tracks.filter_by(id=track_id).first_or_404()
    return send_file(track.thumbnail_path())


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
