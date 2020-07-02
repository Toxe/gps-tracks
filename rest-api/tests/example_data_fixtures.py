import pytest
from app import db
from app.models import User


# Provide example logins:
# - "user1@example.com"/"password1"
# - "user2@example.com"/"password2"
@pytest.fixture
def example_users():
    u1 = User(username="user1", email="user1@example.com", password="pbkdf2:sha256:150000$g2PmcujV$805801fd79bf29cc257644eebec3a35ec24e914028333596ecf4613b57d88b6b")
    u2 = User(username="user2", email="user2@example.com", password="pbkdf2:sha256:150000$3BG1Vrrt$5c4b2d1176251657229a35232a26781351494721e6a0cf6dd67b06ebdcdbfafb")
    db.session.add_all([u1, u2])
    db.session.commit()
