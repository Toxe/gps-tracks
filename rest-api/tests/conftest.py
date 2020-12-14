import os
from tempfile import TemporaryDirectory

import pytest
from flask_jwt_extended import decode_token

from app import create_app, db
from config import Config


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite://"

    def __init__(self, tmp_dir):
        self.GPXFILES_FOLDER = os.path.join(tmp_dir, "gpxfiles")
        self.THUMBNAILS_FOLDER = os.path.join(tmp_dir, "thumbnails")


class Authentication:
    def __init__(self, client):
        self.client = client
        self.user = None
        self.id = None
        self.access_token = None
        self.refresh_token = None
        self.headers = None

    def login(self, email, password):
        r = self.client.post("/auth/login", json={"email": email, "password": password})
        if r.status_code != 200:
            raise RuntimeError("Login failed")
        data = r.get_json()
        self.access_token = data["access_token"]
        self.refresh_token = data["refresh_token"]
        self.headers = {"Authorization": "Bearer {}".format(self.access_token)}
        self.id = decode_token(self.access_token).get("identity")

    def queryUser(self):
        if self.id is None:
            raise RuntimeError("No authenticated user")
        r = self.client.get("/api/users/{}".format(self.id))
        if r.status_code != 200:
            raise RuntimeError("Unable to query data of logged-in user")
        self.user = r.get_json()


@pytest.fixture(name="app")
def fixture_app():
    with TemporaryDirectory() as tmp_dir:
        app = create_app(TestConfig(tmp_dir))
        with app.app_context():
            db.create_all()
            yield app


@pytest.fixture(name="client")
def fixture_client(app):
    with app.test_client() as client:
        yield client


@pytest.fixture(name="auth")
def fixture_auth(client):
    return Authentication(client)
