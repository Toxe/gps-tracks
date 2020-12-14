import os
from io import BytesIO

from flask import current_app
from pytest import approx
from tests.example_data_fixtures import example_gpxfiles, example_tracks, example_users
from tests.util import create_empty_file, directory_is_empty

from app.api.gpxfiles import determine_default_activity_mode, speed_to_kph
from app.models import ActivityMode, GPXFile, Track, User
from app.schemas import gpxfile_schema


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
    assert (
        client.get(
            "/api/users/{}/gpxfiles/99".format(auth.id), headers=auth.headers
        ).status_code
        == 404
    )


def test_get_gpxfiles_without_login(client, example_users, example_gpxfiles):
    assert client.get("/api/users/99/gpxfiles").status_code == 401


def test_get_gpxfile_without_login(client, example_users, example_gpxfiles):
    assert client.get("/api/users/99/gpxfiles/1").status_code == 401


def test_get_gpxfiles_for_different_user_is_forbidden(
    client, auth, example_users, example_gpxfiles
):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/2/gpxfiles", headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_get_gpxfile_for_different_user_is_forbidden(
    client, auth, example_users, example_gpxfiles
):
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
    assert len(data["links"]) == 2
    assert "download" in data["links"]
    assert client.get(data["links"]["owner"], headers=auth.headers).status_code == 200


def test_get_gpxfile_returns_list_of_tracks(
    client, auth, example_users, example_gpxfiles, example_tracks
):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/{}/gpxfiles/1".format(auth.id), headers=auth.headers)
    assert r.status_code == 200
    data = r.get_json()
    assert len(data["tracks"]) == 2
    assert data["tracks"][0]["title"] == "Track 01"
    assert data["tracks"][1]["title"] == "Track 02"


def test_upload_gpxfile(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    auth.queryUser()
    with open("tests/example.gpx", "rb") as fp:
        r = client.post(
            auth.user["links"]["upload_gpxfile"],
            headers=auth.headers,
            data={"file": (fp, "example.gpx")},
        )
        assert r.status_code == 201
        assert r.is_json
        data = r.get_json()
        assert data["id"] > 0
        assert "Location" in r.headers
        assert r.headers.get("Location").endswith(
            "/api/users/1/gpxfiles/{}".format(data["id"])
        )
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
    auth.queryUser()
    r = client.post(
        auth.user["links"]["upload_gpxfile"],
        headers=auth.headers,
        json={"some": "thing"},
    )
    assert r.status_code == 400
    assert r.is_json
    assert r.get_json().get("message") == "GPX file missing."


def test_upload_gpxfile_without_login_fails(client):
    with open("tests/example.gpx", "rb") as fp:
        r = client.post("/api/users/1/gpxfiles", data={"file": (fp, "example.gpx")})
        assert r.status_code == 401


def test_upload_with_bad_gpxfile_fails(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    auth.queryUser()
    fp = BytesIO("not a gpx file".encode("utf8"))
    r = client.post(
        auth.user["links"]["upload_gpxfile"],
        headers=auth.headers,
        data={"file": (fp, "bad.gpx")},
    )
    assert r.status_code == 400
    assert r.get_json().get("message") == "Unable to import uploaded GPX file."
    # make sure no database objects or files were created
    assert len(GPXFile.query.all()) == 0
    assert len(Track.query.all()) == 0
    assert directory_is_empty(current_app.config["GPXFILES_FOLDER"])
    assert directory_is_empty(current_app.config["THUMBNAILS_FOLDER"])


def test_upload_with_bad_xml_gpxfile_fails(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    auth.queryUser()
    fp = BytesIO(
        '<?xml version="1.0" encoding="UTF-8"?><gpx version="1.0">'.encode("utf8")
    )
    r = client.post(
        auth.user["links"]["upload_gpxfile"],
        headers=auth.headers,
        data={"file": (fp, "bad.gpx")},
    )
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
        r = client.post(
            "/api/users/2/gpxfiles",
            headers=auth.headers,
            data={"file": (fp, "example.gpx")},
        )
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
    r = client.delete(
        "/api/users/{}/gpxfiles/{}".format(auth.id, gpxfile.id), headers=auth.headers
    )
    assert r.status_code == 204
    # make sure the static files and database objects were deleted
    assert len(user.gpxfiles.all()) == 1
    assert len(user.tracks.all()) == 1
    assert not os.path.isfile(gpxfile.static_file_path())
    assert not os.path.isfile(track.thumbnail_path())


def test_delete_missing_gpxfile(
    client, auth, example_users, example_gpxfiles, example_tracks
):
    auth.login("user1@example.com", "password1")
    r = client.delete("/api/users/{}/gpxfiles/99".format(auth.id), headers=auth.headers)
    assert r.status_code == 404


def test_delete_gpxfile_without_login(
    client, example_users, example_gpxfiles, example_tracks
):
    assert client.delete("/api/users/1/gpxfiles/1").status_code == 401


def test_delete_gpxfile_for_different_user_is_forbidden(
    client, auth, example_users, example_gpxfiles, example_tracks
):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/2/gpxfiles/3", headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_download_gpxfile(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    auth.queryUser()
    download_link = None
    with open("tests/example.gpx", "rb") as fp:
        r = client.post(
            auth.user["links"]["upload_gpxfile"],
            headers=auth.headers,
            data={"file": (fp, "example.gpx")},
        )
        assert r.status_code == 201
        data = r.get_json()
        download_link = data["links"]["download"]
        assert download_link is not None
    r = client.get(download_link, headers=auth.headers)
    assert r.status_code == 200
    assert r.mimetype == "application/gpx+xml"
    assert len(r.data) > 0


def test_download_gpxfile_without_login(client, auth, example_users, example_gpxfiles):
    assert client.get("/api/users/1/gpxfiles/1/download/test.gpx").status_code == 401


def test_download_gpxfile_from_different_user_is_forbidden(
    client, auth, example_users, example_gpxfiles
):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/2/gpxfiles/3/download/test.gpx", headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_gpxfile_download_filenames_are_secure(app):
    with app.test_request_context():
        g1 = GPXFile(id=1, user_id=1, filename="GPXFile 01.gpx")
        g2 = GPXFile(id=2, user_id=1, filename="GPXFile/02.gpx")
        g3 = GPXFile(id=3, user_id=1, filename="GPX:File 03 Test?.gpx")
        g4 = GPXFile(id=4, user_id=1, filename="GPXFile <04>.gpx")
        assert (
            gpxfile_schema.dump(g1)
            .get("links")
            .get("download")
            .endswith("/download/GPXFile_01.gpx")
        )
        assert (
            gpxfile_schema.dump(g2)
            .get("links")
            .get("download")
            .endswith("/download/GPXFile_02.gpx")
        )
        assert (
            gpxfile_schema.dump(g3)
            .get("links")
            .get("download")
            .endswith("/download/GPXFile_03_Test.gpx")
        )
        assert (
            gpxfile_schema.dump(g4)
            .get("links")
            .get("download")
            .endswith("/download/GPXFile_04.gpx")
        )


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
