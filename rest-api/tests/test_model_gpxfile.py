import os
from app.models import GPXFile


def test_gpxfile_static_file_path_returns_correct_filename(app):
    app.config["GPXFILES_FOLDER"] = "gpxfiles"
    gpxfile = GPXFile(id=1, user_id=1, filename="GPXFile 01")
    assert gpxfile.static_file_path() == "gpxfiles/1.gpx"


def test_can_delete_gpxfile_static_file(app):
    gpxfile = GPXFile(id=1, user_id=1, filename="GPXFile 01")
    filename = gpxfile.static_file_path()
    open(filename, "w").close()
    assert os.path.isfile(filename)
    gpxfile.delete_static_file()
    assert not os.path.isfile(filename)
