import os
from io import BytesIO
from flask import current_app
from app.models import GPXFile, Track
from tests.example_data_fixtures import example_users, example_gpxfiles


def directory_is_empty(dirname):
    return len(os.listdir(dirname)) == 0


def gpxfile_exists(gpxfiles_folder, gpxfile_id):
    return os.path.isfile(os.path.join(gpxfiles_folder, "{}.gpx".format(gpxfile_id)))


def test_get_gpxfiles(client, example_users, example_gpxfiles):
    r = client.get("/api/users/1/gpxfiles")
    assert r.status_code == 200
    assert r.is_json
    assert len(r.get_json()) == 2


def test_get_gpxfile(client, example_users, example_gpxfiles):
    r = client.get("/api/users/1/gpxfiles/1")
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("id") == 1


def test_get_missing_gpxfile(client, example_users, example_gpxfiles):
    assert client.get("/api/users/1/gpxfiles/99").status_code == 404


def test_get_gpxfiles_for_missing_user(client, example_users, example_gpxfiles):
    assert client.get("/api/users/99/gpxfiles").status_code == 404


def test_get_gpxfile_for_missing_user(client, example_users, example_gpxfiles):
    assert client.get("/api/users/99/gpxfiles/1").status_code == 404


def test_upload_gpxfile(client, example_users):
    with open("tests/example.gpx", "rb") as fp:
        r = client.post("/api/users/1/gpxfiles", data={"file": fp})
        assert r.status_code == 201
        assert r.is_json
        data = r.get_json()
        assert data["id"] > 0
        assert "Location" in r.headers
        assert r.headers.get("Location").endswith("/api/users/1/gpxfiles/{}".format(data["id"]))
        # make sure database objects and files were created
        assert len(GPXFile.query.all()) == 1
        assert len(Track.query.all()) == 1
        assert gpxfile_exists(current_app.config["GPXFILES_FOLDER"], data["id"])


def test_upload_without_gpxfile_fails(client, example_users):
    r = client.post("/api/users/1/gpxfiles", json={"some": "thing"})
    assert r.status_code == 400
    assert r.is_json
    assert r.get_json().get("message") == "GPX file missing."


def test_upload_gpxfile_for_non_existing_user_fails(client):
    with open("tests/example.gpx", "rb") as fp:
        r = client.post("/api/users/99/gpxfiles", data={"file": fp})
        assert r.status_code == 404


def test_upload_with_bad_gpxfile_fails(client, example_users):
    fp = BytesIO("not a gpx file".encode("utf8"))
    r = client.post("/api/users/1/gpxfiles", data={"file": (fp, "bad.gpx")})
    assert r.status_code == 400
    assert r.get_json().get("message") == "Unable to import uploaded GPX file."
    # make sure no database objects or files were created
    assert len(GPXFile.query.all()) == 0
    assert len(Track.query.all()) == 0
    assert directory_is_empty(current_app.config["GPXFILES_FOLDER"])


def test_upload_with_bad_xml_gpxfile_fails(client, example_users):
    fp = BytesIO('<?xml version="1.0" encoding="UTF-8"?><gpx version="1.0">'.encode("utf8"))
    r = client.post("/api/users/1/gpxfiles", data={"file": (fp, "bad.gpx")})
    assert r.status_code == 400
    assert r.get_json().get("message") == "Unable to import uploaded GPX file."
    # make sure no database objects or files were created
    assert len(GPXFile.query.all()) == 0
    assert len(Track.query.all()) == 0
    assert directory_is_empty(current_app.config["GPXFILES_FOLDER"])
