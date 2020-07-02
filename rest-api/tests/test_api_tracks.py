from tests.example_data_fixtures import example_users, example_tracks


def test_get_tracks(client, example_users, example_tracks):
    r = client.get("/api/users/1/tracks")
    assert r.status_code == 200
    assert r.is_json
    assert len(r.get_json()) == 2


def test_get_track(client, example_users, example_tracks):
    r = client.get("/api/users/1/tracks/1")
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("id") == 1


def test_get_missing_track(client, example_users, example_tracks):
    assert client.get("/api/users/1/tracks/99").status_code == 404


def test_get_tracks_for_missing_user(client, example_users, example_tracks):
    assert client.get("/api/users/99/tracks").status_code == 404


def test_get_track_for_missing_user(client, example_users, example_tracks):
    assert client.get("/api/users/99/tracks/1").status_code == 404
