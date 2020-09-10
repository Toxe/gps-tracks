from flask import jsonify, request
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                get_jwt_identity, get_raw_jwt,
                                jwt_refresh_token_required, jwt_required)

from app import jwt
from app.auth import bp
from app.errors.handlers import error_response
from app.models import User
from app.schemas import user_schema

blacklist = set()


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    return decrypted_token["jti"] in blacklist


@bp.route("/login", methods=["POST"])
def login():
    if not request.is_json:
        return error_response(400)

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return error_response(400, "Login email address or password missing.")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return error_response(401, "Login email address or password missing.")

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    return jsonify(access_token=access_token, refresh_token=refresh_token)


@bp.route("/refresh", methods=["POST"])
@jwt_refresh_token_required
def refresh():
    user = User.query.get(get_jwt_identity())
    if not user:
        return error_response(401, "Unknown user.")
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token)


# revoke current access token
@bp.route("/logout", methods=["DELETE"])
@jwt_required
def logout_access_token():
    blacklist.add(get_raw_jwt()["jti"])
    return jsonify(message="Successfully logged out.")


# revoke current refresh token
@bp.route("/logout2", methods=["DELETE"])
@jwt_refresh_token_required
def logout_refresh_token():
    blacklist.add(get_raw_jwt()["jti"])
    return jsonify(message="Successfully logged out.")
