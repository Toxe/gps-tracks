import os
from flask import url_for
from app.models import User, Track
from tests.example_data_fixtures import example_users, example_gpxfiles, example_tracks
from tests.util import create_empty_file


def test_get_tracks(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/{}/tracks".format(auth.id), headers=auth.headers)
    assert r.status_code == 200
    assert r.is_json
    assert len(r.get_json()) == 3


def test_get_track(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/{}/tracks/1".format(auth.id), headers=auth.headers)
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("id") == 1


def test_get_missing_track(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    assert client.get("/api/users/{}/tracks/99".format(auth.id), headers=auth.headers).status_code == 404


def test_get_tracks_without_login(client, example_users, example_tracks):
    assert client.get("/api/users/1/tracks").status_code == 401


def test_get_track_without_login(client, example_users, example_tracks):
    assert client.get("/api/users/1/tracks/1").status_code == 401


def test_get_tracks_for_different_user_is_forbidden(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/2/tracks".format(auth.id), headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_get_track_for_different_user_is_forbidden(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/2/tracks/1".format(auth.id), headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_get_track_returns_valid_links(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    track_id = None
    with open("tests/example.gpx", "rb") as fp:
        r = client.post("/api/users/{}/gpxfiles".format(auth.id), headers=auth.headers, data={"file": fp})
        assert r.status_code == 201
        track_id = r.get_json().get("id")
    r = client.get("/api/users/{}/tracks/{}".format(auth.id, track_id), headers=auth.headers)
    assert r.status_code == 200
    data = r.get_json()
    assert client.get(data["links"]["file"], headers=auth.headers).status_code == 200
    assert client.get(data["links"]["owner"], headers=auth.headers).status_code == 200
    assert client.get(data["links"]["segments"], headers=auth.headers).status_code == 200
    assert client.get(data["links"]["thumbnail"], headers=auth.headers).status_code == 200


def test_delete_track(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    user = User.query.get(auth.id)
    assert len(user.tracks.all()) == 3
    track = Track.query.get(1)
    create_empty_file(track.thumbnail_path())
    assert os.path.isfile(track.thumbnail_path())
    r = client.delete("/api/users/{}/tracks/{}".format(auth.id, track.id), headers=auth.headers)
    assert r.status_code == 204
    # make sure the static files and database objects were deleted
    assert len(user.tracks.all()) == 2
    assert not os.path.isfile(track.thumbnail_path())


def test_delete_missing_track(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.delete("/api/users/{}/tracks/99".format(auth.id), headers=auth.headers)
    assert r.status_code == 404


def test_delete_track_without_login(client, example_users, example_tracks):
    assert client.delete("/api/users/1/tracks/1").status_code == 401


def test_delete_track_for_different_user_is_forbidden(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.get("/api/users/2/tracks/3".format(auth.id), headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_get_track_segments(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    segments_link = None
    with open("tests/example.gpx", "rb") as fp:
        r = client.post("/api/users/{}/gpxfiles".format(auth.id), headers=auth.headers, data={"file": fp})
        assert r.status_code == 201
        data = r.get_json()
        segments_link = data["tracks"][0]["links"]["segments"]  # first track
        assert segments_link is not None
    r = client.get(segments_link, headers=auth.headers)
    assert r.status_code == 200
    data = r.get_json()
    assert len(data) > 0
    assert len(data[0]) > 0


def test_download_track_thumbnail(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    thumbnail_link = None
    with open("tests/example.gpx", "rb") as fp:
        r = client.post("/api/users/{}/gpxfiles".format(auth.id), headers=auth.headers, data={"file": fp})
        assert r.status_code == 201
        data = r.get_json()
        thumbnail_link = data["tracks"][0]["links"]["thumbnail"]  # first track
        assert thumbnail_link is not None
    r = client.get(thumbnail_link, headers=auth.headers)
    assert r.status_code == 200
    assert r.mimetype == "image/png"
    assert len(r.data) > 0


def test_download_missing_track_thumbnail(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    r = client.get(url_for("api.get_user_track_thumbnail", user_id=auth.id, track_id=99, thumbnail="test.png"), headers=auth.headers)
    assert r.status_code == 404
