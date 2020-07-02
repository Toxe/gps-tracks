from tests.example_data_fixtures import example_users, example_gpxfiles


def test_get_gpxfiles(client, example_users, example_gpxfiles):
    r = client.get("/api/users/1/gpxfiles")
    assert r.status_code == 200
    assert r.is_json
    assert len(r.get_json()) == 2


def test_get_gpxfile(client, example_users, example_gpxfiles):
    r = client.get("/api/users/1/gpxfiles/1")
    assert r.status_code == 200
    assert r.is_json
    assert r.get_json().get("id") == 1


def test_get_missing_gpxfile(client, example_users, example_gpxfiles):
    assert client.get("/api/users/1/gpxfiles/99").status_code == 404


def test_get_gpxfiles_for_missing_user(client, example_users, example_gpxfiles):
    assert client.get("/api/users/99/gpxfiles").status_code == 404


def test_get_gpxfile_for_missing_user(client, example_users, example_gpxfiles):
    assert client.get("/api/users/99/gpxfiles/1").status_code == 404
