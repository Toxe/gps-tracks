from tests.example_data_fixtures import example_users, example_tracks


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
