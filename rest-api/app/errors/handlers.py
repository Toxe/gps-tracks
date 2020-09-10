from flask import jsonify
from werkzeug.exceptions import InternalServerError, MethodNotAllowed, NotFound
from werkzeug.http import HTTP_STATUS_CODES

from app.errors import bp


def error_response(status_code, message=None):
    payload = {"error": HTTP_STATUS_CODES.get(status_code, "Unknown error")}
    if message:
        payload["message"] = message
    response = jsonify(payload)
    response.status_code = status_code
    return response


@bp.app_errorhandler(NotFound)
def not_found_error(error):
    return error_response(NotFound.code)


@bp.app_errorhandler(MethodNotAllowed)
def method_not_allowed_error(error):
    return error_response(MethodNotAllowed.code)


@bp.app_errorhandler(InternalServerError)
def internal_server_error(error):
    return error_response(InternalServerError.code)
