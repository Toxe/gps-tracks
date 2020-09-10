from tests.example_data_fixtures import example_users


def test_download_thumbnail(client, auth, example_users):
    auth.login("user1@example.com", "password1")
    thumbnail_link = None
    with open("tests/example.gpx", "rb") as fp:
        r = client.post("/api/users/{}/gpxfiles".format(auth.id), headers=auth.headers, data={"file": (fp, "example.gpx")})
        assert r.status_code == 201
        data = r.get_json()
        thumbnail_link = data["tracks"][0]["links"]["thumbnail"]  # first track
        assert thumbnail_link is not None
    r = client.get(thumbnail_link)
    assert r.status_code == 200
    assert r.mimetype == "image/png"
    assert len(r.data) > 0


def test_download_missing_thumbnail(client):
    assert client.get("/thumbnails/test.png").status_code == 404
