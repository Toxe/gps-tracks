import os
import pytest
from app import create_app, db
from config import Config
from flask_jwt_extended import decode_token
from tempfile import TemporaryDirectory


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'

    def __init__(self, tmp_dir):
        self.GPXFILES_FOLDER = os.path.join(tmp_dir, "gpxfiles")
        self.THUMBNAILS_FOLDER = os.path.join(tmp_dir, "thumbnails")


class Authentication:
    def __init__(self, client):
        self.client = client
    def login(self, email, password):
        r = self.client.post("/auth/login", json={"email": email, "password": password})
        if r.status_code != 200:
            raise RuntimeError("Login failed")
        data = r.get_json()
        self.access_token = data["access_token"]
        self.refresh_token = data["refresh_token"]
        self.headers = {"Authorization": "Bearer {}".format(self.access_token)}
        self.id = decode_token(self.access_token).get("identity")


@pytest.fixture
def app():
    with TemporaryDirectory() as tmp_dir:
        app = create_app(TestConfig(tmp_dir))
        with app.app_context():
            db.create_all()
            yield app


@pytest.fixture
def client(app):
    with app.test_client() as client:
        yield client


@pytest.fixture
def auth(client):
    return Authentication(client)
