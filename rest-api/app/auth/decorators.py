from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from app.errors.handlers import error_response


# Custom decorator that checks if a param "user_id" is equal to the JWT user id.
def jwt_and_matching_user_id_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        if get_jwt_identity() != kwargs.get("user_id"):
            return error_response(403, "Access to user resource denied.")
        return fn(*args, **kwargs)
    return wrapper
