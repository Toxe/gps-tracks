import os
from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # create necessary folders if they don't exist
    create_directory_if_necessary(app.config["GPXFILES_FOLDER"])
    create_directory_if_necessary(app.config["THUMBNAILS_FOLDER"])

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app.errors import bp as errors_bp
    app.register_blueprint(errors_bp)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")

    from app.thumbnails import bp as thumbnails_bp
    app.register_blueprint(thumbnails_bp, url_prefix="/thumbnails")

    return app


def create_directory_if_necessary(dirname):
    if not os.path.isdir(dirname):
        os.mkdir(dirname, 0o700)


from app import models, schemas
