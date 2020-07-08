from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.api import bp
from app.models import User, Track, track_schema
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
