import argparse
from collections import namedtuple

import jwt
from requests import Request, Session


class Connection:
    User = namedtuple("User", ["id", "links"])

    def __init__(self, host):
        self.session = Session()
        self.host = host
        self.user = self.User(-1, {})
        self.access_token = None
        self.refresh_token = None
        self.headers = None

    def update_headers_and_tokens(self, access_token, refresh_token):
        self.access_token = access_token
        self.refresh_token = refresh_token
        if access_token is not None:
            self.headers = {"Authorization": f"Bearer {access_token}"}
        else:
            self.headers = None

    def send_request(
        self, method, route, expected_status_code, headers=None, json=None, files=None
    ):
        url = f"{self.host}{route}"
        req = Request(method, url, headers=headers, json=json, files=files)
        r = self.session.send(req.prepare())
        if r.status_code != expected_status_code:
            raise Exception(f"Request error: {method} {route} --> {r.status_code}")
        return r.json()

    def get(self, route):
        return self.send_request("GET", route, 200, headers=self.headers)

    def post(self, route, json):
        return self.send_request("POST", route, 200, headers=self.headers, json=json)

    def put(self, route, json):
        return self.send_request("PUT", route, 200, headers=self.headers, json=json)

    def upload(self, route, files):
        return self.send_request("POST", route, 201, headers=self.headers, files=files)

    def login(self, email, password):
        print(f"Login {email}...")
        data = self.post("/auth/login", json={"email": email, "password": password})
        user_id = jwt.decode(data["access_token"], verify=False).get("identity")
        self.user = self.User(user_id, {})
        self.update_headers_and_tokens(data["access_token"], data["refresh_token"])

    def logout(self):
        print("Logout...")
        headers1 = {"Authorization": f"Bearer {self.access_token}"}
        headers2 = {"Authorization": f"Bearer {self.refresh_token}"}
        self.send_request("DELETE", "/auth/logout", 200, headers=headers1)
        self.send_request("DELETE", "/auth/logout2", 200, headers=headers2)
        self.user = self.User(-1, {})
        self.update_headers_and_tokens(None, None)

    def query_user(self):
        print("Query user info...")
        data = self.get(f"/api/users/{self.user.id}")
        self.user = self.User(self.user.id, data["links"])


def override_track_activity(con, track, activity_mode_override, logger):
    logger(f"PUT activity_mode {track['activity_mode']} --> {activity_mode_override}")
    json = {"title": track["title"], "activity_mode": activity_mode_override}
    con.put(track["links"]["update"], json=json)


def post_file(con, fp, activity_mode_override, logger):
    logger("POST")
    data = con.upload(con.user.links["upload_gpxfile"], files={"file": fp})
    tracks = data["tracks"]
    if activity_mode_override >= 0:
        for track in tracks:
            if track["activity_mode"] != activity_mode_override:
                override_track_activity(con, track, activity_mode_override, logger)


def upload_file(con, fp, activity_mode_override, count_files, current_file):
    def logger(text):
        print(f"[{current_file}/{count_files}] {fp.name}: {text}")

    post_file(con, fp, activity_mode_override, logger)


def upload_all_files(con, filenames, activity_mode_override):
    current_file = 1
    for filename in filenames:
        with open(filename) as fp:
            upload_file(con, fp, activity_mode_override, len(filenames), current_file)
            current_file += 1


def determine_activity_mode_override(args):
    if args.bike:
        return 0
    if args.hiking:
        return 1
    return -1


def eval_args():
    parser = argparse.ArgumentParser(description="Import GPX files.")
    parser.add_argument("filenames", help=".gpx files", nargs="+")
    parser.add_argument(
        "--host",
        help="REST API server host name and port (default: %(default)s)",
        default="http://localhost:5000",
    )
    parser.add_argument(
        "-u",
        "--user",
        help="authentication user (default: %(default)s)",
        default="user1@example.com",
    )
    parser.add_argument(
        "-p",
        "--password",
        help="authentication password (default: %(default)s)",
        default="password1",
    )
    activity_mode_group = parser.add_mutually_exclusive_group()
    activity_mode_group.add_argument(
        "--bike", help="set activity mode to bike", action="store_true"
    )
    activity_mode_group.add_argument(
        "--hiking", help="set activity mode to hiking", action="store_true"
    )
    args = parser.parse_args()
    activity_mode_override = determine_activity_mode_override(args)
    return (args.host, args.user, args.password, args.filenames, activity_mode_override)


def main():
    host, user, password, filenames, activity_mode_override = eval_args()
    con = Connection(host)
    con.login(user, password)
    con.query_user()
    upload_all_files(con, filenames, activity_mode_override)
    con.logout()


if __name__ == "__main__":
    main()
