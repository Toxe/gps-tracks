import pytest
from app import create_app, db
from config import Config
from flask_jwt_extended import decode_token
from app.models import User


class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite://'


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
    app = create_app(TestConfig)
    app.testing = True

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


# Provide example logins:
# - "user1@example.com"/"password1"
# - "user2@example.com"/"password2"
@pytest.fixture
def example_users():
    u1 = User(username="user1", email="user1@example.com", password="pbkdf2:sha256:150000$g2PmcujV$805801fd79bf29cc257644eebec3a35ec24e914028333596ecf4613b57d88b6b")
    u2 = User(username="user2", email="user2@example.com", password="pbkdf2:sha256:150000$3BG1Vrrt$5c4b2d1176251657229a35232a26781351494721e6a0cf6dd67b06ebdcdbfafb")
    db.session.add_all([u1, u2])
    db.session.commit()
