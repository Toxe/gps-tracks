from flask import jsonify, request, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.api import bp
from app.models import User
from app.schemas import user_schema
from app.errors.handlers import error_response
from app.auth.decorators import jwt_and_matching_user_id_required
from marshmallow import ValidationError


@bp.route("/users", methods=["GET"])
def get_users():
    return jsonify(user_schema.dump(User.query.all(), many=True))


@bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user_schema.dump(user))


@bp.route("/users", methods=["POST"])
def create_user():
    try:
        data = user_schema.loads(request.data)
    except ValidationError as err:
        return error_response(400, err.messages)
    if "id" in data and data["id"] != 0:
        return error_response(400)
    if User.query.filter_by(username=data["username"]).first():
        return error_response(400, "User already exists.")
    if User.query.filter_by(email=data["email"]).first():
        return error_response(400, "User already exists.")
    user = User(username=data["username"], email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    response = jsonify(user_schema.dump(user))
    response.status_code = 201
    response.headers["Location"] = url_for("api.get_user", user_id=user.id)
    return response


@bp.route("/users/<int:user_id>", methods=["PUT"])
@jwt_and_matching_user_id_required
def update_user(user_id):
    try:
        data = user_schema.loads(request.data)
    except ValidationError as err:
        return error_response(400, err.messages)
    # "user_id" in request data is optional but if "user_id" was provided then it has to match the resource id
    if data["id"] != 0 and data["id"] != user_id:
        return error_response(400, "Request data id has to match resource id.")
    user = User.query.get_or_404(user_id)
    check_user = User.query.filter_by(username=data["username"]).first()
    if check_user and check_user.id != user_id:
        return error_response(400, "User already exists.")
    check_user = User.query.filter_by(email=data["email"]).first()
    if check_user and check_user.id != user_id:
        return error_response(400, "User already exists.")
    user.username = data["username"]
    user.email = data["email"]
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify(user_schema.dump(user))


@bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_and_matching_user_id_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return "", 204
