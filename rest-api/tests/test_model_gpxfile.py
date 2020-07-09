import os
from app import db
from app.models import User, GPXFile
from tests.example_data_fixtures import example_users


def test_gpxfile_static_file_path_returns_correct_filename(app):
    app.config["GPXFILES_FOLDER"] = "gpxfiles"
    gpxfile = GPXFile(id=1, user_id=1, filename="GPXFile 01")
    assert gpxfile.static_file_path() == "gpxfiles/1.gpx"


def test_can_delete_gpxfile_static_file(app):
    gpxfile = GPXFile(id=1, user_id=1, filename="GPXFile 01")
    open(gpxfile.static_file_path(), "w").close()
    assert os.path.isfile(gpxfile.static_file_path())
    gpxfile.delete_static_file()
    assert not os.path.isfile(gpxfile.static_file_path())


def test_delete_gpxfile_automatically_removes_static_file(app, example_users):
    user = User.query.get(1)
    gpxfile = GPXFile(id=1, owner=user, filename="GPXFile 01")
    db.session.add(gpxfile)
    db.session.commit()
    open(gpxfile.static_file_path(), "w").close()
    assert os.path.isfile(gpxfile.static_file_path())
    db.session.delete(gpxfile)
    db.session.commit()
    assert not os.path.isfile(gpxfile.static_file_path())
