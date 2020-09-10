import os
from datetime import datetime, timedelta
from uuid import uuid4

import pytest
from marshmallow.exceptions import ValidationError
from tests.example_data_fixtures import example_users
from tests.util import create_empty_file

from app import db
from app.models import ActivityMode, Track
from app.schemas import track_schema


def test_track_default_activity_mode_is_bike(app):
    track = Track(user_id=1, gpxfile_id=1, avg_speed=10.0)
    db.session.add(track)
    db.session.commit()
    assert track.activity_mode == ActivityMode.BIKE


def test_track_schema_does_not_accept_invalid_activity_modes():
    with pytest.raises(ValidationError):
        track_schema.load({"activity_mode": -1, "id": 1, "user_id": 1, "gpxfile_id": 1, "title": "Track 01", "time_start": str(datetime.utcnow()), "time_end": str(datetime.utcnow() + timedelta(minutes=5)), "length2d": 1000, "length3d": 1000, "max_speed": 20, "avg_speed": 10, "total_uphill": 50, "total_downhill": 50, "moving_time": 300, "stopped_time": 0})
        track_schema.load({"activity_mode": 99, "id": 1, "user_id": 1, "gpxfile_id": 1, "title": "Track 01", "time_start": str(datetime.utcnow()), "time_end": str(datetime.utcnow() + timedelta(minutes=5)), "length2d": 1000, "length3d": 1000, "max_speed": 20, "avg_speed": 10, "total_uphill": 50, "total_downhill": 50, "moving_time": 300, "stopped_time": 0})


def test_track_thumbnail_path_returns_correct_filename(app):
    app.config["THUMBNAILS_FOLDER"] = "thumbnails"
    uuid = str(uuid4())
    track = Track(thumbnail=uuid)
    assert track.thumbnail_path() == "thumbnails/{}.png".format(uuid)


def test_can_delete_track_thumbnail(app):
    track = Track(thumbnail=str(uuid4()))
    create_empty_file(track.thumbnail_path())
    assert os.path.isfile(track.thumbnail_path())
    track.delete_thumbnail_file()
    assert not os.path.isfile(track.thumbnail_path())


def test_delete_track_automatically_removes_thumbnail_file(app, example_users):
    track = Track(id=1, thumbnail=str(uuid4()))
    db.session.add(track)
    db.session.commit()
    create_empty_file(track.thumbnail_path())
    assert os.path.isfile(track.thumbnail_path())
    db.session.delete(track)
    db.session.commit()
    assert not os.path.isfile(track.thumbnail_path())
