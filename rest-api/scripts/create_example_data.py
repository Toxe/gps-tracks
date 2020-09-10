import requests


HOST = "http://localhost:5000"


def post(route, data):
    print("POST", route)
    r = requests.post("{}{}".format(HOST, route), json=data)
    if r.status_code < 200 or r.status_code >= 300:
        raise Exception("Request error: %d" % r.status_code)


def upload(route, filename, access_token):
    print("POST {} [{}]".format(route, filename))
    headers = {"Authorization": "Bearer {}".format(access_token)}
    r = requests.post("{}{}".format(HOST, route), files={"file": open(filename)}, headers=headers)
    if r.status_code < 200 or r.status_code >= 300:
        raise Exception("Request error: %d" % r.status_code)


def login(route, email, password):
    print("POST {} [{}]".format(route, email))
    r = requests.post("{}{}".format(HOST, route), json={"email": email, "password": password})
    if r.status_code < 200 or r.status_code >= 300:
        raise Exception("Request error: %d" % r.status_code)
    data = r.json()
    return (data["access_token"], data["refresh_token"])


def create_example_data():
    post("/api/users", {"username": "user1", "email": "user1@example.com", "password": "password1"})
    post("/api/users", {"username": "user2", "email": "user2@example.com", "password": "password2"})
    access_token, refresh_token = login("/auth/login", "user1@example.com", "password1")
    upload("/api/users/1/gpxfiles", "tests/example.gpx", access_token)
    upload("/api/users/1/gpxfiles", "tests/example.gpx", access_token)


if __name__ == "__main__":
    create_example_data()
