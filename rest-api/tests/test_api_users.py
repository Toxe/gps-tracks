import os

from app.models import GPXFile, Track
from flask import url_for
from flask_jwt_extended import create_access_token

from tests.example_data_fixtures import example_gpxfiles, example_tracks, example_users
from tests.util import create_empty_file


def test_get_users(client, example_users):
    r = client.get(url_for("api.get_users"))
    assert r.status_code == 200
    assert r.is_json
    assert len(r.get_json()) == 2


def test_get_user(client, example_users):
    r = client.get(url_for("api.get_user", user_id=2))
    assert r.status_code == 200
    assert r.is_json
    data = r.get_json()
    assert data["id"] == 2


def test_get_missing_user(client, example_users):
    assert client.get(url_for("api.get_user", user_id=999)).status_code == 404


def test_get_users_does_not_return_passwords_and_email(client, example_users):
    for user in client.get(url_for("api.get_users")).get_json():
        assert "password" not in user
        assert "email" not in user


def test_get_user_does_not_return_password_and_email(client, example_users):
    user = client.get(url_for("api.get_user", user_id=1)).get_json()
    assert "password" not in user
    assert "email" not in user


def test_get_user_returns_valid_links(
    client, auth, example_users, example_gpxfiles, example_tracks
):
    auth.login("user1@example.com", "password1")
    r = client.get(url_for("api.get_user", user_id=auth.id))
    assert r.status_code == 200
    data = r.get_json()
    assert len(data["links"]) == 3
    assert "upload_gpxfile" in data["links"]
    assert (
        client.get(data["links"]["gpxfiles"], headers=auth.headers).status_code == 200
    )
    assert client.get(data["links"]["tracks"], headers=auth.headers).status_code == 200


def test_create_user(client, example_users):
    json = {
        "username": "new-name",
        "email": "user@example.com",
        "password": "secret",
    }
    r = client.post(url_for("api.create_user"), json=json)
    assert r.status_code == 201
    assert r.is_json
    data = r.get_json()
    assert data["id"] > 0
    assert data["username"] == "new-name"
    assert "Location" in r.headers
    assert r.headers["Location"].endswith(url_for("api.get_user", user_id=data["id"]))


def test_create_user_fails_if_required_field_is_missing(client, example_users):
    json = {"username": "user", "email": "user@example.com"}
    r = client.post(url_for("api.create_user"), json=json)
    assert r.status_code == 400
    assert r.is_json
    data = r.get_json()
    assert "message" in data
    assert "password" in data["message"]
    assert data["message"]["password"][0] == "Missing data for required field."


def test_create_user_fails_if_input_fields_are_too_short(client, example_users):
    json = {"username": "?", "email": "user@example.com", "password": "??"}
    r = client.post(url_for("api.create_user"), json=json)
    assert r.status_code == 400
    assert r.is_json
    data = r.get_json()
    assert "message" in data
    assert "username" in data["message"]
    assert "password" in data["message"]
    assert data["message"]["username"][0] == "Shorter than minimum length 2."
    assert data["message"]["password"][0] == "Shorter than minimum length 4."


def test_create_user_fails_if_data_is_of_wrong_type(client, example_users):
    json = {"username": -1, "password": False, "email": "a.b"}
    r = client.post(url_for("api.create_user"), json=json)
    assert r.status_code == 400
    assert r.is_json
    data = r.get_json()
    assert "message" in data
    assert "username" in data["message"]
    assert "password" in data["message"]
    assert "email" in data["message"]
    assert data["message"]["username"][0] == "Not a valid string."
    assert data["message"]["password"][0] == "Not a valid string."
    assert data["message"]["email"][0] == "Not a valid email address."


def test_create_user_fails_if_data_contains_id(client, example_users):
    json = {
        "id": 1,
        "username": "??",
        "password": "????",
        "email": "user@example.com",
    }
    r = client.post(url_for("api.create_user"), json=json)
    assert r.status_code == 400


def test_create_user_fails_if_username_is_already_taken(client, example_users):
    json = {"username": "user1", "email": "new@example.com", "password": "secret"}
    r = client.post(url_for("api.create_user"), json=json)
    assert r.status_code == 400
    assert r.get_json().get("message") == "User already exists."


def test_create_user_fails_if_email_is_already_taken(client, example_users):
    json = {
        "username": "new-user",
        "email": "user1@example.com",
        "password": "secret",
    }
    r = client.post(url_for("api.create_user"), json=json)
    assert r.status_code == 400
    assert r.get_json().get("message") == "User already exists."


def test_update_user(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    json = {
        "id": auth.id,
        "username": "new-name",
        "email": "new@example.com",
        "password": "new-pwd",
    }
    r = client.put(
        url_for("api.update_user", user_id=auth.id), headers=auth.headers, json=json
    )
    assert r.status_code == 200
    assert r.is_json
    data = r.get_json()
    assert data["id"] == auth.id
    assert data["username"] == "new-name"


def test_update_user_fails_if_username_is_already_taken(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    json = {"username": "user2", "email": "user1@example.com", "password": "????"}
    r = client.put(
        url_for("api.update_user", user_id=auth.id), headers=auth.headers, json=json
    )
    assert r.status_code == 400
    assert r.get_json().get("message") == "User already exists."


def test_update_user_fails_if_email_is_already_taken(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    json = {"username": "user1", "email": "user2@example.com", "password": "????"}
    r = client.put(
        url_for("api.update_user", user_id=auth.id), headers=auth.headers, json=json
    )
    assert r.status_code == 400
    assert r.get_json().get("message") == "User already exists."


def test_update_user_without_login(client, example_users):
    json = {
        "username": "user1",
        "email": "user1@example.com",
        "password": "secret",
    }
    r = client.put(url_for("api.update_user", user_id=1), json=json)
    assert r.status_code == 401


def test_update_non_existing_user(client, example_users):
    json = {
        "id": 99,
        "username": "user1",
        "email": "user1@example.com",
        "password": "secret",
    }
    r = client.put(
        url_for("api.update_user", user_id=99),
        headers={"Authorization": "Bearer " + create_access_token(identity=99)},
        json=json,
    )
    assert r.status_code == 404


def test_update_user_ensures_request_data_id_matches_resource_id(
    client, auth, example_users
):
    """If request data contains an (optional) "id" then it has to match the resource id."""
    auth.login("user1@example.com", "password1")
    url_update_user = url_for("api.update_user", user_id=auth.id)
    json = {
        "id": auth.id,
        "username": "??",
        "email": "user1@example.com",
        "password": "????",
    }
    r = client.put(url_update_user, headers=auth.headers, json=json)
    assert r.status_code == 200
    json = {"username": "??", "email": "user1@example.com", "password": "????"}
    r = client.put(url_update_user, headers=auth.headers, json=json)
    assert r.status_code == 200
    json = {
        "id": auth.id + 1,
        "username": "??",
        "email": "user1@example.com",
        "password": "????",
    }
    r = client.put(url_update_user, headers=auth.headers, json=json)
    assert r.status_code == 400
    data = r.get_json()
    assert "message" in data
    assert data["message"] == "Request data id has to match resource id."


def test_update_different_user_is_forbidden(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    json = {
        "username": "new-name",
        "email": "new@example.com",
        "password": "new-pwd",
    }
    r = client.put(
        url_for("api.update_user", user_id=2), headers=auth.headers, json=json
    )
    assert r.status_code == 403


def test_delete_user(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    r = client.delete(url_for("api.delete_user", user_id=auth.id), headers=auth.headers)
    assert r.status_code == 204


def test_delete_user_without_login(client, example_users):
    assert client.delete(url_for("api.delete_user", user_id=2)).status_code == 401


def test_delete_user_that_does_not_exist(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    r = client.delete(url_for("api.delete_user", user_id=auth.id), headers=auth.headers)
    assert r.status_code == 204
    r = client.delete(url_for("api.delete_user", user_id=auth.id), headers=auth.headers)
    assert r.status_code == 404


def test_delete_different_user_is_forbidden(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    r = client.delete(url_for("api.delete_user", user_id=2), headers=auth.headers)
    assert r.status_code == 403


def test_delete_user_automatically_deletes_gpxfiles_and_tracks(
    client, auth, example_users, example_gpxfiles, example_tracks
):
    auth.login("user1@example.com", "password1")
    assert len(GPXFile.query.all()) == 2
    assert len(Track.query.all()) == 3
    gpxfile = GPXFile.query.get(1)
    create_empty_file(gpxfile.static_file_path())
    assert os.path.isfile(gpxfile.static_file_path())
    r = client.delete(url_for("api.delete_user", user_id=auth.id), headers=auth.headers)
    assert r.status_code == 204
    # make sure the static file and database objects were deleted
    assert len(GPXFile.query.all()) == 0
    assert len(Track.query.all()) == 0
    assert not os.path.isfile(gpxfile.static_file_path())
