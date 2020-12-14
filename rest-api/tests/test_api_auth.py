from flask_jwt_extended import decode_token
from tests.example_data_fixtures import example_users


def test_login(client, example_users):
    r = client.post(
        "/auth/login", json={"email": "user1@example.com", "password": "password1"}
    )
    assert r.status_code == 200
    assert r.is_json
    access_token = r.get_json().get("access_token")
    refresh_token = r.get_json().get("refresh_token")
    assert access_token is not None
    assert refresh_token is not None
    token_data = decode_token(access_token)
    refresh_token_data = decode_token(refresh_token)
    assert token_data.get("identity") == 1
    assert refresh_token_data.get("identity") == 1


def test_login_username_missing(client):
    r = client.post("/auth/login", json={"password": "password1"})
    assert r.status_code == 400
    assert r.is_json
    data = r.get_json()
    assert data.get("message") == "Login email address or password missing."
    assert "access_token" not in data


def test_login_password_missing(client):
    r = client.post("/auth/login", json={"email": "user1@example.com"})
    assert r.status_code == 400
    assert r.is_json
    data = r.get_json()
    assert data.get("message") == "Login email address or password missing."
    assert "access_token" not in data


def test_login_unknown_user(client, example_users):
    r = client.post(
        "/auth/login", json={"email": "unknown@example.com", "password": "password1"}
    )
    assert r.status_code == 401
    assert r.is_json
    data = r.get_json()
    assert data.get("message") == "Login email address or password missing."
    assert "access_token" not in data


def test_login_with_wrong_password(client, example_users):
    r = client.post(
        "/auth/login", json={"email": "user1@example.com", "password": "wrong"}
    )
    assert r.status_code == 401
    assert r.is_json
    data = r.get_json()
    assert data.get("message") == "Login email address or password missing."
    assert "access_token" not in data


def test_refresh_token(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    old_access_token = auth.access_token
    r = client.post(
        "/auth/refresh",
        headers={"Authorization": "Bearer {}".format(auth.refresh_token)},
    )
    assert r.status_code == 200
    assert r.is_json
    access_token = r.get_json().get("access_token")
    assert access_token is not None
    assert access_token != old_access_token
    token_data = decode_token(access_token)
    assert token_data.get("identity") == 1


def test_cannot_call_refresh_for_unknown_user(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    assert (
        client.delete(
            "/api/users/{}".format(auth.id),
            headers={"Authorization": "Bearer {}".format(auth.access_token)},
        ).status_code
        == 204
    )
    assert (
        client.post(
            "/auth/refresh",
            headers={"Authorization": "Bearer {}".format(auth.refresh_token)},
        ).status_code
        == 401
    )


def test_cannot_call_refresh_with_access_token(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    r = client.post(
        "/auth/refresh",
        headers={"Authorization": "Bearer {}".format(auth.access_token)},
    )
    assert r.status_code == 422
    assert r.is_json
    assert r.get_json().get("error") == "Only refresh tokens are allowed"


def test_cannot_call_protected_api_with_refresh_token(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    r = client.delete(
        "/api/users/1",
        headers={"Authorization": "Bearer {}".format(auth.refresh_token)},
    )
    assert r.status_code == 422
    assert r.is_json
    assert r.get_json().get("error") == "Only access tokens are allowed"


def test_logout_access_token(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    # logout and blacklist access token
    r = client.delete(
        "/auth/logout", headers={"Authorization": "Bearer {}".format(auth.access_token)}
    )
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("message") == "Successfully logged out."
    # no longer logged in
    r = client.delete(
        "/api/users/1", headers={"Authorization": "Bearer {}".format(auth.access_token)}
    )
    assert r.status_code == 401
    assert r.is_json
    assert r.get_json().get("error") == "Token has been revoked"
    # request new access token
    r = client.post(
        "/auth/refresh",
        headers={"Authorization": "Bearer {}".format(auth.refresh_token)},
    )
    assert r.status_code == 200


def test_logout_refresh_token(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    # logout refresh token
    r = client.delete(
        "/auth/logout2",
        headers={"Authorization": "Bearer {}".format(auth.refresh_token)},
    )
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("message") == "Successfully logged out."
    # cannot request new access token
    r = client.post(
        "/auth/refresh",
        headers={"Authorization": "Bearer {}".format(auth.refresh_token)},
    )
    assert r.status_code == 401
    assert r.is_json
    assert r.get_json().get("error") == "Token has been revoked"
