import argparse

import jwt
import requests


def login(host, route, email, password):
    json = {"email": email, "password": password}
    url = "{}{}".format(host, route)
    r = requests.post(url, json=json)
    if r.status_code < 200 or r.status_code >= 300:
        raise Exception("Request error: %d" % r.status_code)
    data = r.json()
    user_id = jwt.decode(data["access_token"], verify=False).get("identity")
    return (data["access_token"], user_id)


def override_track_activity(host, track, activity_mode_override, headers, logger):
    logger(
        "PUT activity_mode {} --> {}".format(
            track["activity_mode"], activity_mode_override
        )
    )
    json = {"title": track["title"], "activity_mode": activity_mode_override}
    url = "{}{}".format(host, track["links"]["update"])
    r = requests.put(url, json=json, headers=headers)
    if r.status_code != 200:
        raise Exception("Request error: %d" % r.status_code)


def post_file(host, fp, user_id, headers, activity_mode_override, logger):
    logger("POST")
    url = "{}/api/users/{}/gpxfiles".format(host, user_id)
    r = requests.post(url, files={"file": fp}, headers=headers)
    if r.status_code != 201:
        raise Exception("Request error: %d" % r.status_code)
    tracks = r.json().get("tracks")
    if activity_mode_override >= 0:
        for track in tracks:
            if track["activity_mode"] != activity_mode_override:
                override_track_activity(
                    host, track, activity_mode_override, headers, logger
                )


def upload_file(
    host, fp, user_id, headers, activity_mode_override, count_files, current_file
):
    def logger(text):
        print("[{}/{}] {}: {}".format(current_file, count_files, fp.name, text))

    post_file(host, fp, user_id, headers, activity_mode_override, logger)


def upload_all_files(host, filenames, user_id, access_token, activity_mode_override):
    headers = {"Authorization": "Bearer {}".format(access_token)}
    current_file = 1
    for filename in filenames:
        with open(filename) as fp:
            upload_file(
                host,
                fp,
                user_id,
                headers,
                activity_mode_override,
                len(filenames),
                current_file,
            )
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
    activity_mode_group = parser.add_mutually_exclusive_group()
    activity_mode_group.add_argument(
        "--bike", help="set activity mode to bike", action="store_true"
    )
    activity_mode_group.add_argument(
        "--hiking", help="set activity mode to hiking", action="store_true"
    )
    args = parser.parse_args()
    activity_mode_override = determine_activity_mode_override(args)
    return (args.host, args.filenames, activity_mode_override)


def main():
    host, filenames, activity_mode_override = eval_args()
    access_token, user_id = login(host, "/auth/login", "user1@example.com", "password1")
    upload_all_files(host, filenames, user_id, access_token, activity_mode_override)


if __name__ == "__main__":
    main()
