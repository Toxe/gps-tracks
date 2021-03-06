import os

from app.models import ActivityMode, Track, User
from flask import url_for

from tests.example_data_fixtures import example_gpxfiles, example_tracks, example_users
from tests.util import create_empty_file


def test_get_tracks(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    auth.queryUser()
    r = client.get(auth.user["links"]["tracks"], headers=auth.headers)
    assert r.status_code == 200
    assert r.is_json
    assert len(r.get_json()) == 3


def test_get_track(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.get(
        url_for("api.get_user_track", user_id=auth.id, track_id=1), headers=auth.headers
    )
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("id") == 1


def test_get_missing_track(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.get(
        url_for("api.get_user_track", user_id=auth.id, track_id=99),
        headers=auth.headers,
    )
    assert r.status_code == 404


def test_get_tracks_without_login(client, example_users, example_tracks):
    assert client.get(url_for("api.get_user_tracks", user_id=1)).status_code == 401


def test_get_track_without_login(client, example_users, example_tracks):
    r = client.get(url_for("api.get_user_track", user_id=1, track_id=1))
    assert r.status_code == 401


def test_get_tracks_for_different_user_is_forbidden(
    client, auth, example_users, example_tracks
):
    auth.login("user1@example.com", "password1")
    r = client.get(url_for("api.get_user_tracks", user_id=2), headers=auth.headers)
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_get_track_for_different_user_is_forbidden(
    client, auth, example_users, example_tracks
):
    auth.login("user1@example.com", "password1")
    r = client.get(
        url_for("api.get_user_track", user_id=2, track_id=1), headers=auth.headers
    )
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_get_track_returns_valid_links(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    auth.queryUser()
    track_id = None
    with open("tests/example.gpx", "rb") as fp:
        r = client.post(
            auth.user["links"]["upload_gpxfile"],
            headers=auth.headers,
            data={"file": (fp, "example.gpx")},
        )
        assert r.status_code == 201
        track_id = r.get_json().get("id")
    r = client.get(
        url_for("api.get_user_track", user_id=auth.id, track_id=track_id),
        headers=auth.headers,
    )
    assert r.status_code == 200
    links = r.get_json().get("links")
    assert len(links) == 7
    assert "update" in links
    assert "delete" in links
    assert client.get(links["file"], headers=auth.headers).status_code == 200
    assert client.get(links["owner"], headers=auth.headers).status_code == 200
    assert client.get(links["segments"], headers=auth.headers).status_code == 200
    assert client.get(links["thumbnail"], headers=auth.headers).status_code == 200
    assert client.get(links["download"], headers=auth.headers).status_code == 200


def test_update_track(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.put(
        url_for("api.update_user_track", user_id=auth.id, track_id=1),
        headers=auth.headers,
        json={"activity_mode": ActivityMode.HIKING.value, "title": "new title"},
    )
    assert r.status_code == 200
    assert r.is_json
    data = r.get_json()
    assert data["activity_mode"] == ActivityMode.HIKING.value
    assert data["title"] == "new title"


def test_update_track_fails_with_missing_fields(
    client, auth, example_users, example_tracks
):
    auth.login("user1@example.com", "password1")
    r = client.put(
        url_for("api.update_user_track", user_id=auth.id, track_id=1),
        headers=auth.headers,
        json={},
    )
    assert r.status_code == 400
    r = client.put(
        url_for("api.update_user_track", user_id=auth.id, track_id=1),
        headers=auth.headers,
        json={"activity_mode": ActivityMode.HIKING.value},
    )
    assert r.status_code == 400
    r = client.put(
        url_for("api.update_user_track", user_id=auth.id, track_id=1),
        headers=auth.headers,
        json={"title": "new title"},
    )
    assert r.status_code == 400


def test_update_track_fails_with_unknown_fields(
    client, auth, example_users, example_tracks
):
    auth.login("user1@example.com", "password1")
    r = client.put(
        url_for("api.update_user_track", user_id=auth.id, track_id=1),
        headers=auth.headers,
        json={
            "unknown_field": "some value",
            "activity_mode": ActivityMode.HIKING.value,
            "title": "new title",
        },
    )
    assert r.status_code == 400


def test_update_track_without_login(client, example_users, example_tracks):
    r = client.put(
        url_for("api.update_user_track", user_id=1, track_id=1),
        json={"activity_mode": ActivityMode.HIKING.value, "title": "new title"},
    )
    assert r.status_code == 401


def test_update_missing_track(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.put(
        url_for("api.update_user_track", user_id=auth.id, track_id=99),
        headers=auth.headers,
        json={"activity_mode": ActivityMode.HIKING.value, "title": "new title"},
    )
    assert r.status_code == 404


def test_update_track_for_different_user(client, auth, example_users, example_tracks):
    auth.login("user2@example.com", "password2")
    r = client.put(
        url_for("api.update_user_track", user_id=1, track_id=1),
        headers=auth.headers,
        json={"activity_mode": ActivityMode.HIKING.value, "title": "new title"},
    )
    assert r.status_code == 403


def test_delete_track_automatically_removes_gpxfile(
    client, auth, example_users, example_gpxfiles, example_tracks
):
    auth.login("user1@example.com", "password1")
    user = User.query.get(auth.id)
    assert len(user.gpxfiles.all()) == 2
    assert len(user.tracks.all()) == 3
    track = Track.query.get(3)
    gpxfile = track.file
    create_empty_file(gpxfile.static_file_path())
    create_empty_file(track.thumbnail_path())
    assert os.path.isfile(gpxfile.static_file_path())
    assert os.path.isfile(track.thumbnail_path())
    r = client.delete(
        url_for("api.delete_user_track", user_id=auth.id, track_id=track.id),
        headers=auth.headers,
    )
    assert r.status_code == 204
    # make sure the static files and database objects (including gpxfile) were deleted
    assert len(user.gpxfiles.all()) == 1
    assert len(user.tracks.all()) == 2
    assert not os.path.isfile(gpxfile.static_file_path())
    assert not os.path.isfile(track.thumbnail_path())


def test_delete_track_does_not_removes_gpxfile_with_multiple_tracks(
    client, auth, example_users, example_gpxfiles, example_tracks
):
    auth.login("user1@example.com", "password1")
    user = User.query.get(auth.id)
    assert len(user.gpxfiles.all()) == 2
    assert len(user.tracks.all()) == 3
    track = Track.query.get(1)
    gpxfile = track.file
    assert len(gpxfile.tracks.all()) == 2
    create_empty_file(gpxfile.static_file_path())
    create_empty_file(track.thumbnail_path())
    assert os.path.isfile(gpxfile.static_file_path())
    assert os.path.isfile(track.thumbnail_path())
    r = client.delete(
        url_for("api.delete_user_track", user_id=auth.id, track_id=track.id),
        headers=auth.headers,
    )
    assert r.status_code == 204
    # make sure the thumbnail file and track database object were deleted
    assert len(user.gpxfiles.all()) == 2
    assert len(user.tracks.all()) == 2
    assert not os.path.isfile(track.thumbnail_path())
    # make sure gpxfile still exists and has one track left
    assert len(gpxfile.tracks.all()) == 1
    assert os.path.isfile(gpxfile.static_file_path())


def test_delete_missing_track(client, auth, example_users, example_tracks):
    auth.login("user1@example.com", "password1")
    r = client.delete(
        url_for("api.delete_user_track", user_id=auth.id, track_id=99),
        headers=auth.headers,
    )
    assert r.status_code == 404


def test_delete_track_without_login(client, example_users, example_tracks):
    r = client.delete(url_for("api.delete_user_track", user_id=1, track_id=1))
    assert r.status_code == 401


def test_delete_track_for_different_user_is_forbidden(
    client, auth, example_users, example_tracks
):
    auth.login("user1@example.com", "password1")
    r = client.delete(
        url_for("api.delete_user_track", user_id=2, track_id=3), headers=auth.headers
    )
    assert r.status_code == 403
    assert r.is_json
    assert r.get_json().get("message") == "Access to user resource denied."


def test_get_track_segments(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    auth.queryUser()
    segments_link = None
    with open("tests/example.gpx", "rb") as fp:
        r = client.post(
            auth.user["links"]["upload_gpxfile"],
            headers=auth.headers,
            data={"file": (fp, "example.gpx")},
        )
        assert r.status_code == 201
        data = r.get_json()
        segments_link = data["tracks"][0]["links"]["segments"]  # first track
        assert segments_link is not None
    r = client.get(segments_link, headers=auth.headers)
    assert r.status_code == 200
    data = r.get_json()
    assert len(data) > 0
    assert len(data[0]) > 0


def test_download_track(client, auth, example_users):
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
        download_link = data["tracks"][0]["links"]["download"]  # first track
        assert download_link is not None
    r = client.get(download_link, headers=auth.headers)
    assert r.status_code == 200
    assert r.mimetype == "application/gpx+xml"
    assert len(r.data) > 0
