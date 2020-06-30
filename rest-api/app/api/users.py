from flask import jsonify, request, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.api import bp
from app.models import User, user_schema
from app.errors import error_response
from marshmallow import ValidationError


@bp.route("/users", methods=["GET"])
def get_users():
    return jsonify(user_schema.dump(User.query.all(), many=True))


@bp.route("/users/<int:id>", methods=["GET"])
def get_user(id):
    user = User.query.get(id)
    if user is None:
        return error_response(404)
    return jsonify(user_schema.dump(user))


@bp.route("/users", methods=["POST"])
def create_user():
    try:
        data = user_schema.loads(request.data)
    except ValidationError as err:
        return error_response(400, err.messages)
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
    response.headers["Location"] = url_for("api.get_user", id=user.id)
    return response


@bp.route("/users/<int:id>", methods=["PUT"])
@jwt_required
def update_user(id):
    if id != get_jwt_identity():
        return error_response(403)
    try:
        data = user_schema.loads(request.data)
    except ValidationError as err:
        return error_response(400, err.messages)
    user = User.query.get(id)
    if user is None:
        return error_response(404)
    # "id" in request data is optional
    if user.id == 0:
        user.id = id
    # if "id" was provided in request data then it has to match the resource id
    if user.id != id:
        return error_response(400, "Request data id has to match resource id.")
    check_user = User.query.filter_by(username=data["username"]).first()
    if check_user and check_user.id != id:
        return error_response(400, "User already exists.")
    check_user = User.query.filter_by(email=data["email"]).first()
    if check_user and check_user.id != id:
        return error_response(400, "User already exists.")
    user.username = data["username"]
    user.email = data["email"]
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    response = jsonify(user_schema.dump(user))
    return response


@bp.route("/users/<int:id>", methods=["DELETE"])
@jwt_required
def delete_user(id):
    if id != get_jwt_identity():
        return error_response(403)
    user = User.query.get(id)
    if user is None:
        return error_response(404)
    db.session.delete(user)
    db.session.commit()
    return "", 204
