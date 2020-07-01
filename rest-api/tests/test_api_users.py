import pytest
from app import db
from app.models import User
from flask_jwt_extended import create_access_token


# example users ("user1@example.com"/"password1", "user2@example.com"/"password2")
@pytest.fixture
def with_example_users():
    u1 = User(username="user1", email="user1@example.com", password="pbkdf2:sha256:150000$g2PmcujV$805801fd79bf29cc257644eebec3a35ec24e914028333596ecf4613b57d88b6b")
    u2 = User(username="user2", email="user2@example.com", password="pbkdf2:sha256:150000$3BG1Vrrt$5c4b2d1176251657229a35232a26781351494721e6a0cf6dd67b06ebdcdbfafb")
    db.session.add_all([u1, u2])
    db.session.commit()


def test_get_users(client, with_example_users):
    r = client.get("/api/users")
    assert r.status_code == 200
    assert r.is_json
    assert len(r.get_json()) == 2


def test_get_user(client, with_example_users):
    r = client.get("/api/users/2")
    assert r.status_code == 200
    assert r.is_json
    data = r.get_json()
    assert data["id"] == 2


def test_get_missing_user(client, with_example_users):
    assert client.get("/api/users/999").status_code == 404


def test_get_users_does_not_return_passwords_and_email(client, with_example_users):
    for user in client.get("/api/users").get_json():
        assert "password" not in user
        assert "email" not in user


def test_get_user_does_not_return_password_and_email(client, with_example_users):
    user = client.get("/api/users/1").get_json()
    assert "password" not in user
    assert "email" not in user


def test_create_user(client, with_example_users):
    r = client.post("/api/users", json={"username": "new-name", "email": "user@example.com", "password": "secret"})
    assert r.status_code == 201
    assert r.is_json
    data = r.get_json()
    assert data["id"] > 0
    assert data["username"] == "new-name"
    assert "Location" in r.headers
    assert r.headers["Location"].endswith("/api/users/{}".format(data["id"]))


def test_create_user_fails_if_required_field_is_missing(client, with_example_users):
    r = client.post("/api/users", json={"username": "user", "email": "user@example.com"})
    assert r.status_code == 400
    assert r.is_json
    data = r.get_json()
    assert "message" in data
    assert "password" in data["message"]
    assert data["message"]["password"][0] == "Missing data for required field."


def test_create_user_fails_if_input_fields_are_too_short(client, with_example_users):
    r = client.post("/api/users", json={"username": "?", "email": "user@example.com", "password": "??"})
    assert r.status_code == 400
    assert r.is_json
    data = r.get_json()
    assert "message" in data
    assert "username" in data["message"]
    assert "password" in data["message"]
    assert data["message"]["username"][0] == "Shorter than minimum length 2."
    assert data["message"]["password"][0] == "Shorter than minimum length 4."


def test_create_user_fails_if_data_is_of_wrong_type(client, with_example_users):
    r = client.post("/api/users", json={"username": -1, "password": False, "email": "a.b"})
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


def test_create_user_fails_if_data_contains_id(client, with_example_users):
    r = client.post("/api/users", json={"id": 1, "username": "??", "password": "????", "email": "user@example.com"})
    assert r.status_code == 400


def test_create_user_fails_if_username_is_already_taken(client, with_example_users):
    r = client.post("/api/users", json={"username": "user1", "email": "new@example.com", "password": "secret"})
    assert r.status_code == 400
    assert r.get_json().get("message") == "User already exists."


def test_create_user_fails_if_email_is_already_taken(client, with_example_users):
    r = client.post("/api/users", json={"username": "new-user", "email": "user1@example.com", "password": "secret"})
    assert r.status_code == 400
    assert r.get_json().get("message") == "User already exists."


def test_update_user(client, auth, with_example_users):
    auth.login("user1@example.com", "password1")
    r = client.put("/api/users/{}".format(auth.id), headers=auth.headers, json={"id": auth.id, "username": "new-name", "email": "new@example.com", "password": "new-pwd"})
    assert r.status_code == 200
    assert r.is_json
    data = r.get_json()
    assert data["id"] == 1
    assert data["username"] == "new-name"


def test_update_user_without_login(client, with_example_users):
    assert client.put("/api/users/1", json={"username": "user1", "email": "user1@example.com", "password": "secret"}).status_code == 401


def test_update_non_existing_user(client, with_example_users):
    r = client.put("/api/users/99", json={"id": 99, "username": "user1", "email": "user1@example.com", "password": "secret"}, headers={"Authorization": "Bearer " + create_access_token(identity=99)})
    assert r.status_code == 404


def test_update_user_ensures_request_data_id_matches_resource_id(client, auth, with_example_users):
    """If request data contains an (optional) "id" then it has to match the resource id."""
    auth.login("user1@example.com", "password1")
    assert client.put("/api/users/{}".format(auth.id), headers=auth.headers, json={"id": auth.id, "username": "??", "email": "user1@example.com", "password": "????"}).status_code == 200
    assert client.put("/api/users/{}".format(auth.id), headers=auth.headers, json={"username": "??", "email": "user1@example.com", "password": "????"}).status_code == 200
    r = client.put("/api/users/{}".format(auth.id), headers=auth.headers, json={"id": auth.id + 1, "username": "??", "email": "user1@example.com", "password": "????"})
    assert r.status_code == 400
    data = r.get_json()
    assert "message" in data
    assert data["message"] == "Request data id has to match resource id."


def test_delete_user(client, auth, with_example_users):
    auth.login("user1@example.com", "password1")
    assert client.delete("/api/users/{}".format(auth.id), headers=auth.headers).status_code == 204


def test_delete_user_without_login(client, with_example_users):
    assert client.delete("/api/users/1").status_code == 401


def test_delete_user_that_does_not_exist(client, auth, with_example_users):
    auth.login("user1@example.com", "password1")
    assert client.delete("/api/users/{}".format(auth.id), headers=auth.headers).status_code == 204
    assert client.delete("/api/users/{}".format(auth.id), headers=auth.headers).status_code == 404
