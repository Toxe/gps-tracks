from flask import Blueprint

bp = Blueprint("thumbnails", __name__)

from app.thumbnails import thumbnails
