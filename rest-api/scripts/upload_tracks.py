import sys

import jwt
import requests


host = "http://localhost:5000"


def login(route, email, password):
    json = {"email": email, "password": password}
    r = requests.post("{}{}".format(host, route), json=json)
    if r.status_code < 200 or r.status_code >= 300:
        raise Exception("Request error: %d" % r.status_code)
    data = r.json()
    user_id = jwt.decode(data["access_token"], verify=False).get("identity")
    return (data["access_token"], user_id)


def upload_tracks(filenames, user_id, access_token):
    headers = {"Authorization": "Bearer {}".format(access_token)}
    num_files = len(filenames)
    count = 0
    for filename in filenames:
        with open(filename) as fp:
            r = requests.post(
                "{}/api/users/{}/gpxfiles".format(host, user_id),
                files={"file": fp},
                headers=headers,
            )
            if r.status_code != 201:
                raise Exception("Request error: %d" % r.status_code)
            count += 1
            print("[{}/{}] {}".format(count, num_files, filename))


def eval_args():
    if len(sys.argv) <= 1:
        raise Exception("Usage: %s <gpx files>" % sys.argv[0])
    return sys.argv[1:]


def main():
    filenames = eval_args()
    access_token, user_id = login("/auth/login", "user1@example.com", "password1")
    upload_tracks(filenames, user_id, access_token)


if __name__ == "__main__":
    main()
