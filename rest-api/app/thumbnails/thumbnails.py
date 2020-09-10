from flask import current_app, send_from_directory

from app import db
from app.thumbnails import bp


# Deliver a thumbnail. This should just be a fallback for development and
# ideally the web server should serve the images.
@bp.route("/<filename>", methods=["GET"])
def get_thumbnail(filename):
    return send_from_directory(current_app.config["THUMBNAILS_FOLDER"], filename)
