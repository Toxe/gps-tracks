import os
from io import BytesIO
from flask import current_app
from app.models import User, GPXFile, Track
from app.models import ActivityMode
from app.api.gpxfiles import speed_to_kph, determine_default_activity_mode
from tests.example_data_fixtures import example_users, example_gpxfiles, example_tracks
from tests.util import create_empty_file
from pytest import approx


# ---- helper functions ----

def directory_is_empty(dirname):
    return len(os.listdir(dirname)) == 0


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
    r = client.get("/api/users/2/gpxfiles", headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_get_gpxfile_for_different_user_is_forbidden(client, auth, example_users, example_gpxfiles):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/2/gpxfiles/3", headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_get_gpxfile_returns_valid_links(client, auth, example_users, example_gpxfiles):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/{}/gpxfiles/1".format(auth.id), headers=auth.headers)
    assert r.status_code == 200
    data = r.get_json()
    assert client.get(data["links"]["owner"], headers=auth.headers).status_code == 200


def test_get_gpxfile_returns_list_of_tracks(client, auth, example_users, example_gpxfiles, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/{}/gpxfiles/1".format(auth.id), headers=auth.headers)
    assert r.status_code == 200
    data = r.get_json()
    assert len(data["tracks"]) == 2
    assert data["tracks"][0]["title"] == "Track 01"
    assert data["tracks"][1]["title"] == "Track 02"


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
        gpxfile = GPXFile.query.get(data["id"])
        assert gpxfile is not None
        assert len(gpxfile.tracks.all()) == 1
        assert os.path.isfile(gpxfile.static_file_path())
        track = gpxfile.tracks.first()
        assert track is not None
        assert os.path.isfile(track.thumbnail_path())


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
    assert directory_is_empty(current_app.config["THUMBNAILS_FOLDER"])


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
    assert directory_is_empty(current_app.config["THUMBNAILS_FOLDER"])


def test_upload_for_different_user_is_forbidden(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    with open("tests/example.gpx", "rb") as fp:
        r = client.post("/api/users/2/gpxfiles", headers=auth.headers, data={"file": fp})
        assert r.status_code == 403
        assert r.is_json
        assert r.get_json().get("message") == "Access to user resource denied."
        # make sure no database objects or files were created
        assert len(GPXFile.query.all()) == 0
        assert len(Track.query.all()) == 0
        assert directory_is_empty(current_app.config["GPXFILES_FOLDER"])
        assert directory_is_empty(current_app.config["THUMBNAILS_FOLDER"])


def test_delete_gpxfile(client, auth, example_users, example_gpxfiles, example_tracks):
    auth.login("user1@example.com", "password1")
    user = User.query.get(auth.id)
    assert len(user.gpxfiles.all()) == 2
    assert len(user.tracks.all()) == 3
    gpxfile = GPXFile.query.get(1)
    track = gpxfile.tracks.first()
    create_empty_file(gpxfile.static_file_path())
    create_empty_file(track.thumbnail_path())
    assert os.path.isfile(gpxfile.static_file_path())
    assert os.path.isfile(track.thumbnail_path())
    r = client.delete("/api/users/{}/gpxfiles/{}".format(auth.id, gpxfile.id), headers=auth.headers)
    assert r.status_code == 204
    # make sure the static files and database objects were deleted
    assert len(user.gpxfiles.all()) == 1
    assert len(user.tracks.all()) == 1
    assert not os.path.isfile(gpxfile.static_file_path())
    assert not os.path.isfile(track.thumbnail_path())


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


def test_determine_default_activity_mode():
    assert determine_default_activity_mode(-1.0) == ActivityMode.BIKE.value
    assert determine_default_activity_mode(0.0) == ActivityMode.BIKE.value
    assert determine_default_activity_mode(0.001) == ActivityMode.HIKING.value
    assert determine_default_activity_mode(3.0) == ActivityMode.HIKING.value
    assert determine_default_activity_mode(4.999) == ActivityMode.HIKING.value
    assert determine_default_activity_mode(5.0) == ActivityMode.HIKING.value
    assert determine_default_activity_mode(5.1) == ActivityMode.BIKE.value
    assert determine_default_activity_mode(10.0) == ActivityMode.BIKE.value
