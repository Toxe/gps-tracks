# coding=utf8
#
# Usage:
#   $ rm gps_tracks.db && rm -r gpxfiles && rm -r thumbnails && flask db upgrade && python scripts/create_example_data.py
#   $ python scripts/generate_api_examples.py > api.txt

import re
import json
import subprocess


api_calls = {
    "Authentication": [
        {"api": ["POST", "/auth/login"], "title": "Login", "data": {"email": "user1@example.com", "password": "password1"}, "headers": ["json"], "save_jwt_tokens": True},
        {"api": ["POST", "/auth/refresh"], "title": "Refresh access token", "headers": ["refresh"], "save_jwt_tokens": True},
        {"api": ["DELETE", "/auth/logout"], "title": "Logout and revoke access token", "headers": ["access"]},
        {"api": ["DELETE", "/auth/logout2"], "title": "Logout and revoke refresh token", "headers": ["refresh"]},
    ],
    "Users": [
        {"api": ["GET", "/api/users"], "title": "List all users", "desc": "This will not return stored passwords or email addresses."},
        {"api": ["GET", "/api/users/<user_id>"], "title": "Query single user", "desc": "This will not return the user password or email address.", "params": {"user_id": "1"}},
        {"api": ["POST", "/api/users"], "title": "Create new user", "data": {"username": "New User", "email": "user@example.com", "password": "secret"}, "headers": ["json"]},
        {"api": ["POST", "/auth/login"], "silent": True, "data": {"email": "user@example.com", "password": "secret"}, "headers": ["json"], "save_jwt_tokens": True},
        {"api": ["PUT", "/api/users/<user_id>"], "title": "Update user data", "desc": "Login required and can only change own data.", "data": {"username": "Shiny new username", "email": "new@example.com", "password": "different password"}, "params": {"user_id": "3"}, "headers": ["access", "json"]},
        {"api": ["DELETE", "/api/users/<user_id>"], "title": "Delete user", "desc": "Login required and can only delete the current user.", "params": {"user_id": "3"}, "headers": ["access"]},
    ],
    "GPX Files": [
        {"api": ["POST", "/auth/login"], "silent": True, "data": {"email": "user1@example.com", "password": "password1"}, "headers": ["json"], "save_jwt_tokens": True},
        {"api": ["GET", "/api/users/<user_id>/gpxfiles"], "title": "List user GPX files", "params": {"user_id": "1"}, "headers": ["access"]},
        {"api": ["GET", "/api/users/<user_id>/gpxfiles/<gpxfile_id>"], "title": "Get user GPX file", "params": {"user_id": "1", "gpxfile_id": "1"}, "headers": ["access"]},
        {"api": ["POST", "/api/users/<user_id>/gpxfiles"], "title": "Upload new GPX file for user", "file_upload": "tests/example.gpx", "params": {"user_id": "1"}, "headers": ["access"]},
        {"api": ["DELETE", "/api/users/<user_id>/gpxfiles/<gpxfile_id>"], "title": "Delete user GPX file and associated tracks", "params": {"user_id": "1", "gpxfile_id": "3"}, "headers": ["access"]},
    ],
    "Tracks": [
        {"api": ["GET", "/api/users/<user_id>/tracks"], "title": "List user tracks", "params": {"user_id": "1"}, "headers": ["access"]},
        {"api": ["GET", "/api/users/<user_id>/tracks/<track_id>"], "title": "Get user track", "params": {"user_id": "1", "track_id": "1"}, "headers": ["access"]},
        {"api": ["DELETE", "/api/users/<user_id>/tracks/<track_id>"], "title": "Delete user track", "params": {"user_id": "1", "track_id": "1"}, "headers": ["access"]},
    ],
}

host = "http://localhost:5000"

access_token = ""
refresh_token = ""

REGEXP = re.compile(r"^HTTP/1.. 2..")


def dump_curl_command(cmd):
    params = []
    for p in cmd:
        if '"' in p or ' ' in p:
            params.append("'%s'" % p)
        else:
            params.append(p)
    print("```")
    print("$", " ".join(params))
    print("```")
    print()


def dump_curl_response(response_headers, response_data):
    print("```http")
    print(response_headers)
    print()
    if response_data != "":
        print(response_data)
    print("```")
    print()


def save_jwt_tokens(response_data):
    global access_token, refresh_token
    data = json.loads(response_data)
    if "access_token" in data:
        access_token = data["access_token"]
    if "refresh_token" in data:
        refresh_token = data["refresh_token"]


def split_curl_output(curl_output):
    empty_line = curl_output.find("\n\n")
    if empty_line < 0:
        return (curl_output, "")
    else:
        return (curl_output[:empty_line], curl_output[empty_line:].strip())


def curl(call, silent=False):
    method = call["api"][0]
    route = call["api"][1]
    if "params" in call:
        for param, value in call["params"].items():
            route = route.replace("<%s>" % param, value)
    cmd = ["curl", "-i", "{}{}".format(host, route)]
    if method == "PUT" or method == "DELETE":
        cmd.append("-X")
        cmd.append(method)
    if method == "POST":
        if "file_upload" in call:
            cmd.append("-F")
            cmd.append("file=@%s" % call["file_upload"])
        else:
            cmd.append("-X")
            cmd.append(method)
    if "data" in call:
        cmd.append("-d")
        cmd.append(json.dumps(call["data"]))
    if "headers" in call:
        if "json" in call["headers"]:
            cmd.append("-H")
            cmd.append("Content-Type: application/json")
        if "access" in call["headers"]:
            cmd.append("-H")
            cmd.append("Authorization: Bearer {}".format(access_token))
        if "refresh" in call["headers"]:
            cmd.append("-H")
            cmd.append("Authorization: Bearer {}".format(refresh_token))
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        raise Exception("curl error, exit code: %d" % p.returncode)
    if REGEXP.match(p.stdout) is None:
        raise Exception("Request error:\n%s" % p.stdout)
    response_headers, response_data = split_curl_output(p.stdout)
    if not silent:
        if "desc" in call:
            print(call["desc"])
            print()
        dump_curl_command(cmd)
        dump_curl_response(response_headers, response_data)
    if call.get("save_jwt_tokens") is True:
        save_jwt_tokens(response_data)


def generate_call(call):
    silent = call.get("silent", False)
    if not silent:
        print("##### `{}` `{}`: {}".format(call["api"][0], call["api"][1], call["title"]))
        print()
    curl(call, silent)


def generate_section_summary(calls):
    print("| Method | Route | Description |")
    print("| ------ | ----- | ----------- |")
    for call in calls:
        if not call.get("silent", False):
            print("| {} | {} | {} |".format(call["api"][0], call["api"][1], call["title"]))
    print()


def generate_api_index(api_calls):
    for section in api_calls:
        print("- [{}](#{})".format(section, section.lower().replace(" ", "-")))
    print()


def generate_section(section, calls):
    print("### {}".format(section))
    print()
    generate_section_summary(calls)
    for call in calls:
        generate_call(call)


def generate_api_examples():
    print("## REST API")
    print()
    generate_api_index(api_calls)
    for section in api_calls:
        generate_section(section, api_calls[section])


if __name__ == "__main__":
    generate_api_examples()
