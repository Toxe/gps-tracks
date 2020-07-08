import os
from io import BytesIO
from flask import current_app
from app.models import User, GPXFile, Track
from app.api.gpxfiles import speed_to_kph
from tests.example_data_fixtures import example_users, example_gpxfiles, example_tracks
from pytest import approx


# ---- helper functions ----

def directory_is_empty(dirname):
    return len(os.listdir(dirname)) == 0


def gpxfile_exists(gpxfiles_folder, gpxfile_id):
    return os.path.isfile(os.path.join(gpxfiles_folder, "{}.gpx".format(gpxfile_id)))


# ---- tests ----

def test_get_gpxfiles(client, auth, example_users, example_gpxfiles):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/{}/gpxfiles".format(auth.id), headers=auth.headers)
    assert r.status_code == 200
    assert r.is_json
    assert len(r.get_json()) == 2


def test_get_gpxfile(client, auth, example_users, example_gpxfiles):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/{}/gpxfiles/1".format(auth.id), headers=auth.headers)
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("id") == 1


def test_get_missing_gpxfile(client, auth, example_users, example_gpxfiles):
    auth.login("user1@example.com", "password1")
    assert client.get("/api/users/{}/gpxfiles/99".format(auth.id), headers=auth.headers).status_code == 404


def test_get_gpxfiles_without_login(client, example_users, example_gpxfiles):
    assert client.get("/api/users/99/gpxfiles").status_code == 401


def test_get_gpxfile_without_login(client, example_users, example_gpxfiles):
    assert client.get("/api/users/99/gpxfiles/1").status_code == 401


def test_get_gpxfiles_for_different_user_is_forbidden(client, auth, example_users, example_gpxfiles):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/2/gpxfiles".format(auth.id), headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_get_gpxfile_for_different_user_is_forbidden(client, auth, example_users, example_gpxfiles):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/2/gpxfiles/3".format(auth.id), headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_upload_gpxfile(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    with open("tests/example.gpx", "rb") as fp:
        r = client.post("/api/users/{}/gpxfiles".format(auth.id), headers=auth.headers, data={"file": fp})
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


def test_upload_without_gpxfile_fails(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    r = client.post("/api/users/{}/gpxfiles".format(auth.id), headers=auth.headers, json={"some": "thing"})
    assert r.status_code == 400
    assert r.is_json
    assert r.get_json().get("message") == "GPX file missing."


def test_upload_gpxfile_without_login_fails(client):
    with open("tests/example.gpx", "rb") as fp:
        r = client.post("/api/users/1/gpxfiles", data={"file": fp})
        assert r.status_code == 401


def test_upload_with_bad_gpxfile_fails(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    fp = BytesIO("not a gpx file".encode("utf8"))
    r = client.post("/api/users/{}/gpxfiles".format(auth.id), headers=auth.headers, data={"file": (fp, "bad.gpx")})
    assert r.status_code == 400
    assert r.get_json().get("message") == "Unable to import uploaded GPX file."
    # make sure no database objects or files were created
    assert len(GPXFile.query.all()) == 0
    assert len(Track.query.all()) == 0
    assert directory_is_empty(current_app.config["GPXFILES_FOLDER"])


def test_upload_with_bad_xml_gpxfile_fails(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    fp = BytesIO('<?xml version="1.0" encoding="UTF-8"?><gpx version="1.0">'.encode("utf8"))
    r = client.post("/api/users/{}/gpxfiles".format(auth.id), headers=auth.headers, data={"file": (fp, "bad.gpx")})
    assert r.status_code == 400
    assert r.get_json().get("message") == "Unable to import uploaded GPX file."
    # make sure no database objects or files were created
    assert len(GPXFile.query.all()) == 0
    assert len(Track.query.all()) == 0
    assert directory_is_empty(current_app.config["GPXFILES_FOLDER"])


def test_upload_for_different_user_is_forbidden(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    with open("tests/example.gpx", "rb") as fp:
        r = client.post("/api/users/2/gpxfiles".format(auth.id), headers=auth.headers, data={"file": fp})
        assert r.status_code == 403
        assert r.is_json
        assert r.get_json().get("message") == "Access to user resource denied."
        # make sure no database objects or files were created
        assert len(GPXFile.query.all()) == 0
        assert len(Track.query.all()) == 0
        assert directory_is_empty(current_app.config["GPXFILES_FOLDER"])


def test_delete_gpxfile(client, auth, example_users, example_gpxfiles, example_tracks):
    auth.login("user1@example.com", "password1")
    user = User.query.get(auth.id)
    assert len(user.gpxfiles.all()) == 2
    assert len(user.tracks.all()) == 3
    r = client.delete("/api/users/{}/gpxfiles/1".format(auth.id), headers=auth.headers)
    assert r.status_code == 204
    # make sure database objects were deleted
    assert len(user.gpxfiles.all()) == 1
    assert len(user.tracks.all()) == 1


def test_delete_missing_gpxfile(client, auth, example_users, example_gpxfiles, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.delete("/api/users/{}/gpxfiles/99".format(auth.id), headers=auth.headers)
    assert r.status_code == 404


def test_delete_gpxfile_without_login(client, example_users, example_gpxfiles, example_tracks):
    assert client.delete("/api/users/1/gpxfiles/1").status_code == 401


def test_delete_gpxfile_for_different_user_is_forbidden(client, auth, example_users, example_gpxfiles, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/2/gpxfiles/3".format(auth.id), headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_speed_to_kph_works():
    assert speed_to_kph(0.0) == approx(0.0)
    assert speed_to_kph(1.0) == approx(3.6)
    assert speed_to_kph(10.0) == approx(36.0)
