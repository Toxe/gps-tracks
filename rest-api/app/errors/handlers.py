from flask import jsonify
from app.errors import bp
from werkzeug.http import HTTP_STATUS_CODES
from werkzeug.exceptions import NotFound, InternalServerError


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


@bp.app_errorhandler(InternalServerError)
def internal_server_error(error):
    return error_response(InternalServerError.code)
