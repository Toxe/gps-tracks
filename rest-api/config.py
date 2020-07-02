import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, ".env"))

class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY") or b'\x8d=\xe2\xc1\xfa\xa4n\xfc\x02\xfc\xc6\xa5\xc7d\xc1\xba*\xeb\xdd\xaf:\xce\x95#HO\x0b\x18\x84\xcf\xf4\xc7D\x0c\xa3x\xea\x17\xe26'
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///" + os.path.join(basedir, "gps_tracks.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or b'\x1ao\x07\xc4\xd9"\x07\xb5\xa9-\xf1\xac\xf3\x82\x99\x0b\xe3\xb5\x84\xcae6\x9dY2:\xbd~2\xdb\x89g\x192"\n\x8b\x85t\xcd'
    JWT_ERROR_MESSAGE_KEY = "error"
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]
    GPXFILES_FOLDER = os.environ.get("GPXFILES_FOLDER") or os.path.join(basedir, "gpxfiles")
