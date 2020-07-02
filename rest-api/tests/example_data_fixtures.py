import pytest
from app import db
from app.models import User, GPXFile, Track
from datetime import datetime, timedelta


# Provide example logins:
# - "user1@example.com"/"password1"
# - "user2@example.com"/"password2"
@pytest.fixture
def example_users():
    u1 = User(
        id=1,
        username="user1",
        email="user1@example.com",
        password="pbkdf2:sha256:150000$g2PmcujV$805801fd79bf29cc257644eebec3a35ec24e914028333596ecf4613b57d88b6b",
    )
    u2 = User(
        id=2,
        username="user2",
        email="user2@example.com",
        password="pbkdf2:sha256:150000$3BG1Vrrt$5c4b2d1176251657229a35232a26781351494721e6a0cf6dd67b06ebdcdbfafb",
    )
    db.session.add_all([u1, u2])
    db.session.commit()


# Provide example GPX files:
@pytest.fixture
def example_gpxfiles():
    g1 = GPXFile(id=1, user_id=1, filename="GPXFile 01")
    g2 = GPXFile(id=2, user_id=1, filename="GPXFile 02")
    db.session.add_all([g1, g2])
    db.session.commit()


# Provide example GPX tracks:
@pytest.fixture
def example_tracks():
    t1 = Track(
        id=1,
        user_id=1,
        gpxfile_id=1,
        title="Track 01",
        time_start=datetime.utcnow(),
        time_end=datetime.utcnow() + timedelta(minutes=5),
        length2d=1000,
        length3d=1000,
        max_speed=20,
        avg_speed=10,
        total_uphill=50,
        total_downhill=50,
        moving_time=300,
        stopped_time=0,
    )
    t2 = Track(
        id=2,
        user_id=1,
        gpxfile_id=1,
        title="Track 01",
        time_start=datetime.utcnow(),
        time_end=datetime.utcnow() + timedelta(minutes=5),
        length2d=1000,
        length3d=1000,
        max_speed=20,
        avg_speed=10,
        total_uphill=50,
        total_downhill=50,
        moving_time=300,
        stopped_time=0,
    )
    db.session.add_all([t1, t2])
    db.session.commit()
