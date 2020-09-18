# GPS Tracks

## Dependencies

- Python REST API:
  - Python 3.8+
  - [Poetry](https://python-poetry.org)
- React App:
  - Axios
  - Babel CLI
  - babel-plugin-i18next-extract
  - date-fns
  - history
  - i18next
  - i18next-browser-languagedetector
  - i18next-http-backend
  - jsonwebtoken
  - lodash
  - Material UI
  - React
  - React Router 6
  - react-i18next
  - Roboto font

## Setup Virtual Environment and install Dependencies

The Python REST API uses [Poetry](https://python-poetry.org) for dependency management and virtual environment.

```
$ cd rest-api
$ poetry install
$ poetry shell
```

## Configuration

### Flask: `.flaskenv` for development and debugging

```ini
FLASK_APP=main
FLASK_ENV=development
```

### Visual Studio Code: `.vscode/settings.json`

For a better `pylint` experience:

- Load the plugins `pylint_flask` and `pylint_flask_sqlalchemy`.
- Pass the location of `pyproject.toml` to `pylint` to load some config settings.

```json
{
    "python.linting.enabled": true,
    "python.linting.pylintArgs": [
        "--rcfile=rest-api/pyproject.toml",
        "--load-plugins=pylint_flask,pylint_flask_sqlalchemy"
    ]
}
```

## REST API server

### Run development version

```
$ cat .flaskenv
FLASK_APP=main
FLASK_ENV=development
```

```
$ flask run
```

### Tests

Run either:

```
pytest
```

```
python3 -m pytest
```

### Create a new SQLite database with example data

This assumes that the REST API server is running at `http://localhost:5000`.

```
$ rm gps_tracks.db
$ flask db upgrade
$ python scripts/create_example_data.py
POST /api/users
POST /api/users
POST /auth/login [user1@example.com]
POST /api/users/1/gpxfiles [tests/example.gpx]
POST /api/users/1/gpxfiles [tests/example.gpx]
```

### Open Flask CLI context

Run IPython shell and execute application commands.

```
$ flask shell
```

```python
from datetime import datetime, timedelta

u1 = User(id=1, username="user1", email="user1@example.com")
u2 = User(id=2, username="user2", email="user2@example.com")
u1.set_password("password1")
u2.set_password("password2")
db.session.add_all([u1, u2])
db.session.commit()

g1 = GPXFile(id=1, owner=u1, filename="GPXFile 01")
g2 = GPXFile(id=2, owner=u1, filename="GPXFile 02")
db.session.add_all([g1, g2])
db.session.commit()

t1 = Track(id=1, owner=u1, file=g1, title="Track 01", time_start=datetime.utcnow(), time_end=datetime.utcnow() + timedelta(minutes=5), length2d=1000, length3d=1000, max_speed=20, avg_speed=10, total_uphill=50, total_downhill=50, moving_time=300, stopped_time=0)
t2 = Track(id=2, owner=u1, file=g1, title="Track 02", time_start=datetime.utcnow(), time_end=datetime.utcnow() + timedelta(minutes=5), length2d=1000, length3d=1000, max_speed=20, avg_speed=10, total_uphill=50, total_downhill=50, moving_time=300, stopped_time=0)
t3 = Track(id=3, owner=u1, file=g2, title="Track 03", time_start=datetime.utcnow(), time_end=datetime.utcnow() + timedelta(minutes=5), length2d=1000, length3d=1000, max_speed=20, avg_speed=10, total_uphill=50, total_downhill=50, moving_time=300, stopped_time=0)
db.session.add_all([t1, t2, t3])
db.session.commit()
```

## REST API Routes

```
$ flask routes --sort rule
Endpoint                     Methods  Rule
---------------------------  -------  ----------------------------------------------------------------------
api.get_users                GET      /api/users
api.create_user              POST     /api/users
api.get_user                 GET      /api/users/<int:user_id>
api.update_user              PUT      /api/users/<int:user_id>
api.delete_user              DELETE   /api/users/<int:user_id>
api.get_user_gpxfiles        GET      /api/users/<int:user_id>/gpxfiles
api.upload_user_gpxfile      POST     /api/users/<int:user_id>/gpxfiles
api.get_user_gpxfile         GET      /api/users/<int:user_id>/gpxfiles/<int:gpxfile_id>
api.delete_user_gpxfile      DELETE   /api/users/<int:user_id>/gpxfiles/<int:gpxfile_id>
api.download_user_gpxfile    GET      /api/users/<int:user_id>/gpxfiles/<int:gpxfile_id>/download/<filename>
api.get_user_tracks          GET      /api/users/<int:user_id>/tracks
api.get_user_track           GET      /api/users/<int:user_id>/tracks/<int:track_id>
api.delete_user_track        DELETE   /api/users/<int:user_id>/tracks/<int:track_id>
api.update_user_track        PUT      /api/users/<int:user_id>/tracks/<int:track_id>
api.get_user_track_segments  GET      /api/users/<int:user_id>/tracks/<int:track_id>/segments
auth.login                   POST     /auth/login
auth.logout_access_token     DELETE   /auth/logout
auth.logout_refresh_token    DELETE   /auth/logout2
auth.refresh                 POST     /auth/refresh
thumbnails.get_thumbnail     GET      /thumbnails/<filename>
```

## REST API

- [Authentication](#authentication)
- [Users](#users)
- [GPX Files](#gpx-files)
- [Tracks](#tracks)
- [Track Segments](#track-segments)

### Authentication

| Method | Route | Description |
| ------ | ----- | ----------- |
| POST | /auth/login | Login |
| POST | /auth/refresh | Refresh access token |
| DELETE | /auth/logout | Logout and revoke access token |
| DELETE | /auth/logout2 | Logout and revoke refresh token |

##### `POST` `/auth/login`: Login

```
$ curl -i http://localhost:5000/auth/login -X POST -d '{"email": "user1@example.com", "password": "password1"}' -H 'Content-Type: application/json'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 568
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:32 GMT

{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTIsIm5iZiI6MTYwMDQyNjk1MiwianRpIjoiNjhmOGNhZDUtNjQ2OS00ZjNlLTg0MGItMWRmZDhkNGJhOTc1IiwiZXhwIjoxNjAwNDI3ODUyLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.E_LoLMSQCzFMTzkr9N1MCR32OhKOf8Z58BvhtOBJ4AU",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTIsIm5iZiI6MTYwMDQyNjk1MiwianRpIjoiMzhkZjRkZDMtMWMwMy00MzdmLWE3ZWMtZTU0YWY2NGM4MjYzIiwiZXhwIjoxNjAzMDE4OTUyLCJpZGVudGl0eSI6MSwidHlwZSI6InJlZnJlc2gifQ.6Pl2yiZHIq6pRse4zsqO7Sf2X94yy-wJvpUyo1AYIVo"
}
```

##### `POST` `/auth/refresh`: Refresh access token

```
$ curl -i http://localhost:5000/auth/refresh -X POST -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTIsIm5iZiI6MTYwMDQyNjk1MiwianRpIjoiMzhkZjRkZDMtMWMwMy00MzdmLWE3ZWMtZTU0YWY2NGM4MjYzIiwiZXhwIjoxNjAzMDE4OTUyLCJpZGVudGl0eSI6MSwidHlwZSI6InJlZnJlc2gifQ.6Pl2yiZHIq6pRse4zsqO7Sf2X94yy-wJvpUyo1AYIVo'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 293
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:32 GMT

{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTIsIm5iZiI6MTYwMDQyNjk1MiwianRpIjoiNmI4MzljY2YtMzhlZC00MjRlLTgwNDUtYTg5ODM4N2Q0MTEzIiwiZXhwIjoxNjAwNDI3ODUyLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.kP_M6LKBY7OPt4U_0C8xc_mUYxKY10taF4lvwLUqzCE"
}
```

##### `DELETE` `/auth/logout`: Logout and revoke access token

```
$ curl -i http://localhost:5000/auth/logout -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTIsIm5iZiI6MTYwMDQyNjk1MiwianRpIjoiNmI4MzljY2YtMzhlZC00MjRlLTgwNDUtYTg5ODM4N2Q0MTEzIiwiZXhwIjoxNjAwNDI3ODUyLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.kP_M6LKBY7OPt4U_0C8xc_mUYxKY10taF4lvwLUqzCE'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 44
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:32 GMT

{
  "message": "Successfully logged out."
}
```

##### `DELETE` `/auth/logout2`: Logout and revoke refresh token

```
$ curl -i http://localhost:5000/auth/logout2 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTIsIm5iZiI6MTYwMDQyNjk1MiwianRpIjoiMzhkZjRkZDMtMWMwMy00MzdmLWE3ZWMtZTU0YWY2NGM4MjYzIiwiZXhwIjoxNjAzMDE4OTUyLCJpZGVudGl0eSI6MSwidHlwZSI6InJlZnJlc2gifQ.6Pl2yiZHIq6pRse4zsqO7Sf2X94yy-wJvpUyo1AYIVo'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 44
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:32 GMT

{
  "message": "Successfully logged out."
}
```

### Users

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /api/users | List all users |
| GET | /api/users/<user_id> | Query single user |
| POST | /api/users | Create new user |
| PUT | /api/users/<user_id> | Update user data |
| DELETE | /api/users/<user_id> | Delete user |

##### `GET` `/api/users`: List all users

This will not return stored passwords or email addresses.

```
$ curl -i http://localhost:5000/api/users
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 308
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:32 GMT

[
  {
    "id": 1,
    "links": {
      "gpxfiles": "/api/users/1/gpxfiles",
      "tracks": "/api/users/1/tracks"
    },
    "username": "user1"
  },
  {
    "id": 2,
    "links": {
      "gpxfiles": "/api/users/2/gpxfiles",
      "tracks": "/api/users/2/tracks"
    },
    "username": "user2"
  }
]
```

##### `GET` `/api/users/<user_id>`: Query single user

This will not return the user password or email address.

```
$ curl -i http://localhost:5000/api/users/1
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 135
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:32 GMT

{
  "id": 1,
  "links": {
    "gpxfiles": "/api/users/1/gpxfiles",
    "tracks": "/api/users/1/tracks"
  },
  "username": "user1"
}
```

##### `POST` `/api/users`: Create new user

```
$ curl -i http://localhost:5000/api/users -X POST -d '{"username": "New User", "email": "user@example.com", "password": "secret"}' -H 'Content-Type: application/json'
```

```http
HTTP/1.0 201 CREATED
Content-Type: application/json
Content-Length: 138
Location: http://localhost:5000/api/users/3
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:32 GMT

{
  "id": 3,
  "links": {
    "gpxfiles": "/api/users/3/gpxfiles",
    "tracks": "/api/users/3/tracks"
  },
  "username": "New User"
}
```

##### `PUT` `/api/users/<user_id>`: Update user data

Login required and can only change own data.

```
$ curl -i http://localhost:5000/api/users/3 -X PUT -d '{"username": "Shiny new username", "email": "new@example.com", "password": "different password"}' -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTIsIm5iZiI6MTYwMDQyNjk1MiwianRpIjoiOGZkZGMyY2YtYTM3Yy00OThkLWIzNDgtNTc2N2MzM2VmMjU4IiwiZXhwIjoxNjAwNDI3ODUyLCJpZGVudGl0eSI6MywiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.rJWbPoTYiI_BndzafPoafIOzP09sJ_4OgMUQpEUxbGE'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 148
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:32 GMT

{
  "id": 3,
  "links": {
    "gpxfiles": "/api/users/3/gpxfiles",
    "tracks": "/api/users/3/tracks"
  },
  "username": "Shiny new username"
}
```

##### `DELETE` `/api/users/<user_id>`: Delete user

Login required and can only delete the current user.

```
$ curl -i http://localhost:5000/api/users/3 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTIsIm5iZiI6MTYwMDQyNjk1MiwianRpIjoiOGZkZGMyY2YtYTM3Yy00OThkLWIzNDgtNTc2N2MzM2VmMjU4IiwiZXhwIjoxNjAwNDI3ODUyLCJpZGVudGl0eSI6MywiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.rJWbPoTYiI_BndzafPoafIOzP09sJ_4OgMUQpEUxbGE'
```

```http
HTTP/1.0 204 NO CONTENT
Content-Type: text/html; charset=utf-8
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:32 GMT

```

### GPX Files

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /api/users/<user_id>/gpxfiles | List user GPX files |
| GET | /api/users/<user_id>/gpxfiles/<gpxfile_id> | Get user GPX file |
| POST | /api/users/<user_id>/gpxfiles | Upload new GPX file for user |
| GET | /api/users/<user_id>/gpxfiles/<gpxfile_id>/download/<filename> | Download GPX file |
| DELETE | /api/users/<user_id>/gpxfiles/<gpxfile_id> | Delete user GPX file and associated tracks |

##### `GET` `/api/users/<user_id>/gpxfiles`: List user GPX files

```
$ curl -i http://localhost:5000/api/users/1/gpxfiles -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTMsIm5iZiI6MTYwMDQyNjk1MywianRpIjoiMzZhMjBkOTktNmI0NS00YzVkLWI4OTgtZWFlNDAwMDk3NzI3IiwiZXhwIjoxNjAwNDI3ODUzLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.eAywpLZhwrzAOASB7s4Pmrj_eFOOh0GMYYY2Q-hTfLM'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 2408
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:33 GMT

[
  {
    "filename": "example.gpx",
    "id": 1,
    "links": {
      "download": "/api/users/1/gpxfiles/1/download/example.gpx",
      "owner": "/api/users/1"
    },
    "time_imported": "2020-09-18T11:02:30.536996",
    "tracks": [
      {
        "activity_mode": 1,
        "avg_speed": 3.0769410345863024,
        "gpxfile_id": 1,
        "id": 1,
        "length2d": 117.8943998190882,
        "length3d": 118.20254402707839,
        "links": {
          "delete": "/api/users/1/tracks/1",
          "download": "/api/users/1/gpxfiles/1/download/example.gpx",
          "file": "/api/users/1/gpxfiles/1",
          "owner": "/api/users/1",
          "segments": "/api/users/1/tracks/1/segments",
          "thumbnail": "/thumbnails/303c8c62-0491-47a4-be1c-50a2f65e6295.png"
        },
        "max_speed": 0.0,
        "moving_time": 89.0,
        "stopped_time": 162.0,
        "thumbnail": "303c8c62-0491-47a4-be1c-50a2f65e6295",
        "time_end": "2007-10-14T10:14:08",
        "time_start": "2007-10-14T10:09:57",
        "title": "Example gpx",
        "total_downhill": 3.0,
        "total_uphill": 3.0,
        "user_id": 1
      }
    ],
    "user_id": 1
  },
  {
    "filename": "example.gpx",
    "id": 2,
    "links": {
      "download": "/api/users/1/gpxfiles/2/download/example.gpx",
      "owner": "/api/users/1"
    },
    "time_imported": "2020-09-18T11:02:30.574469",
    "tracks": [
      {
        "activity_mode": 1,
        "avg_speed": 3.0769410345863024,
        "gpxfile_id": 2,
        "id": 2,
        "length2d": 117.8943998190882,
        "length3d": 118.20254402707839,
        "links": {
          "delete": "/api/users/1/tracks/2",
          "download": "/api/users/1/gpxfiles/2/download/example.gpx",
          "file": "/api/users/1/gpxfiles/2",
          "owner": "/api/users/1",
          "segments": "/api/users/1/tracks/2/segments",
          "thumbnail": "/thumbnails/7b932aa4-2f5f-48b0-971c-dbff4d20aeb1.png"
        },
        "max_speed": 0.0,
        "moving_time": 89.0,
        "stopped_time": 162.0,
        "thumbnail": "7b932aa4-2f5f-48b0-971c-dbff4d20aeb1",
        "time_end": "2007-10-14T10:14:08",
        "time_start": "2007-10-14T10:09:57",
        "title": "Example gpx",
        "total_downhill": 3.0,
        "total_uphill": 3.0,
        "user_id": 1
      }
    ],
    "user_id": 1
  }
]
```

##### `GET` `/api/users/<user_id>/gpxfiles/<gpxfile_id>`: Get user GPX file

```
$ curl -i http://localhost:5000/api/users/1/gpxfiles/1 -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTMsIm5iZiI6MTYwMDQyNjk1MywianRpIjoiMzZhMjBkOTktNmI0NS00YzVkLWI4OTgtZWFlNDAwMDk3NzI3IiwiZXhwIjoxNjAwNDI3ODUzLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.eAywpLZhwrzAOASB7s4Pmrj_eFOOh0GMYYY2Q-hTfLM'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 1125
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:33 GMT

{
  "filename": "example.gpx",
  "id": 1,
  "links": {
    "download": "/api/users/1/gpxfiles/1/download/example.gpx",
    "owner": "/api/users/1"
  },
  "time_imported": "2020-09-18T11:02:30.536996",
  "tracks": [
    {
      "activity_mode": 1,
      "avg_speed": 3.0769410345863024,
      "gpxfile_id": 1,
      "id": 1,
      "length2d": 117.8943998190882,
      "length3d": 118.20254402707839,
      "links": {
        "delete": "/api/users/1/tracks/1",
        "download": "/api/users/1/gpxfiles/1/download/example.gpx",
        "file": "/api/users/1/gpxfiles/1",
        "owner": "/api/users/1",
        "segments": "/api/users/1/tracks/1/segments",
        "thumbnail": "/thumbnails/303c8c62-0491-47a4-be1c-50a2f65e6295.png"
      },
      "max_speed": 0.0,
      "moving_time": 89.0,
      "stopped_time": 162.0,
      "thumbnail": "303c8c62-0491-47a4-be1c-50a2f65e6295",
      "time_end": "2007-10-14T10:14:08",
      "time_start": "2007-10-14T10:09:57",
      "title": "Example gpx",
      "total_downhill": 3.0,
      "total_uphill": 3.0,
      "user_id": 1
    }
  ],
  "user_id": 1
}
```

##### `POST` `/api/users/<user_id>/gpxfiles`: Upload new GPX file for user

```
$ curl -i http://localhost:5000/api/users/1/gpxfiles -F file=@tests/example.gpx -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTMsIm5iZiI6MTYwMDQyNjk1MywianRpIjoiMzZhMjBkOTktNmI0NS00YzVkLWI4OTgtZWFlNDAwMDk3NzI3IiwiZXhwIjoxNjAwNDI3ODUzLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.eAywpLZhwrzAOASB7s4Pmrj_eFOOh0GMYYY2Q-hTfLM'
```

```http
HTTP/1.0 201 CREATED
Content-Type: application/json
Content-Length: 1125
Location: http://localhost:5000/api/users/1/gpxfiles/3
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:33 GMT

{
  "filename": "example.gpx",
  "id": 3,
  "links": {
    "download": "/api/users/1/gpxfiles/3/download/example.gpx",
    "owner": "/api/users/1"
  },
  "time_imported": "2020-09-18T11:02:33.104383",
  "tracks": [
    {
      "activity_mode": 1,
      "avg_speed": 3.0769410345863024,
      "gpxfile_id": 3,
      "id": 3,
      "length2d": 117.8943998190882,
      "length3d": 118.20254402707839,
      "links": {
        "delete": "/api/users/1/tracks/3",
        "download": "/api/users/1/gpxfiles/3/download/example.gpx",
        "file": "/api/users/1/gpxfiles/3",
        "owner": "/api/users/1",
        "segments": "/api/users/1/tracks/3/segments",
        "thumbnail": "/thumbnails/cc1847b2-282e-43aa-9fd5-411c393cd9c2.png"
      },
      "max_speed": 0.0,
      "moving_time": 89.0,
      "stopped_time": 162.0,
      "thumbnail": "cc1847b2-282e-43aa-9fd5-411c393cd9c2",
      "time_end": "2007-10-14T10:14:08",
      "time_start": "2007-10-14T10:09:57",
      "title": "Example gpx",
      "total_downhill": 3.0,
      "total_uphill": 3.0,
      "user_id": 1
    }
  ],
  "user_id": 1
}
```

##### `GET` `/api/users/<user_id>/gpxfiles/<gpxfile_id>/download/<filename>`: Download GPX file

```
$ curl -i http://localhost:5000/api/users/1/gpxfiles/3/download/example.gpx -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTMsIm5iZiI6MTYwMDQyNjk1MywianRpIjoiMzZhMjBkOTktNmI0NS00YzVkLWI4OTgtZWFlNDAwMDk3NzI3IiwiZXhwIjoxNjAwNDI3ODUzLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.eAywpLZhwrzAOASB7s4Pmrj_eFOOh0GMYYY2Q-hTfLM'
```

```http
HTTP/1.0 200 OK
Content-Length: 967
Content-Type: application/gpx+xml; charset=utf-8
Last-Modified: Fri, 18 Sep 2020 11:02:33 GMT
Cache-Control: public, max-age=43200
Expires: Fri, 18 Sep 2020 23:02:33 GMT
ETag: "1600426953.1287062-967-2142837976"
Date: Fri, 18 Sep 2020 11:02:33 GMT
Server: Werkzeug/1.0.1 Python/3.8.5

<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.0">
	<name>Example gpx</name>
	<wpt lat="46.57638889" lon="8.89263889">
		<ele>2372</ele>
		<name>LAGORETICO</name>
	</wpt>
	<trk><name>Example gpx</name><number>1</number><trkseg>
		<trkpt lat="46.57608333" lon="8.89241667"><ele>2376</ele><time>2007-10-14T10:09:57Z</time></trkpt>
		<trkpt lat="46.57619444" lon="8.89252778"><ele>2375</ele><time>2007-10-14T10:10:52Z</time></trkpt>
		<trkpt lat="46.57641667" lon="8.89266667"><ele>2372</ele><time>2007-10-14T10:12:39Z</time></trkpt>
		<trkpt lat="46.57650000" lon="8.89280556"><ele>2373</ele><time>2007-10-14T10:13:12Z</time></trkpt>
		<trkpt lat="46.57638889" lon="8.89302778"><ele>2374</ele><time>2007-10-14T10:13:20Z</time></trkpt>
		<trkpt lat="46.57652778" lon="8.89322222"><ele>2375</ele><time>2007-10-14T10:13:48Z</time></trkpt>
		<trkpt lat="46.57661111" lon="8.89344444"><ele>2376</ele><time>2007-10-14T10:14:08Z</time></trkpt>
	</trkseg></trk>
</gpx>
```

##### `DELETE` `/api/users/<user_id>/gpxfiles/<gpxfile_id>`: Delete user GPX file and associated tracks

```
$ curl -i http://localhost:5000/api/users/1/gpxfiles/3 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTMsIm5iZiI6MTYwMDQyNjk1MywianRpIjoiMzZhMjBkOTktNmI0NS00YzVkLWI4OTgtZWFlNDAwMDk3NzI3IiwiZXhwIjoxNjAwNDI3ODUzLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.eAywpLZhwrzAOASB7s4Pmrj_eFOOh0GMYYY2Q-hTfLM'
```

```http
HTTP/1.0 204 NO CONTENT
Content-Type: text/html; charset=utf-8
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:33 GMT

```

### Tracks

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /api/users/<user_id>/tracks | List user tracks |
| GET | /api/users/<user_id>/tracks/<track_id> | Get user track |
| PUT | /api/users/<user_id>/tracks/<track_id> | Update user track |
| DELETE | /api/users/<user_id>/tracks/<track_id> | Delete user track |

##### `GET` `/api/users/<user_id>/tracks`: List user tracks

```
$ curl -i http://localhost:5000/api/users/1/tracks -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTMsIm5iZiI6MTYwMDQyNjk1MywianRpIjoiMzZhMjBkOTktNmI0NS00YzVkLWI4OTgtZWFlNDAwMDk3NzI3IiwiZXhwIjoxNjAwNDI3ODUzLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.eAywpLZhwrzAOASB7s4Pmrj_eFOOh0GMYYY2Q-hTfLM'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 1666
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:33 GMT

[
  {
    "activity_mode": 1,
    "avg_speed": 3.0769410345863024,
    "gpxfile_id": 1,
    "id": 1,
    "length2d": 117.8943998190882,
    "length3d": 118.20254402707839,
    "links": {
      "delete": "/api/users/1/tracks/1",
      "download": "/api/users/1/gpxfiles/1/download/example.gpx",
      "file": "/api/users/1/gpxfiles/1",
      "owner": "/api/users/1",
      "segments": "/api/users/1/tracks/1/segments",
      "thumbnail": "/thumbnails/303c8c62-0491-47a4-be1c-50a2f65e6295.png"
    },
    "max_speed": 0.0,
    "moving_time": 89.0,
    "stopped_time": 162.0,
    "thumbnail": "303c8c62-0491-47a4-be1c-50a2f65e6295",
    "time_end": "2007-10-14T10:14:08",
    "time_start": "2007-10-14T10:09:57",
    "title": "Example gpx",
    "total_downhill": 3.0,
    "total_uphill": 3.0,
    "user_id": 1
  },
  {
    "activity_mode": 1,
    "avg_speed": 3.0769410345863024,
    "gpxfile_id": 2,
    "id": 2,
    "length2d": 117.8943998190882,
    "length3d": 118.20254402707839,
    "links": {
      "delete": "/api/users/1/tracks/2",
      "download": "/api/users/1/gpxfiles/2/download/example.gpx",
      "file": "/api/users/1/gpxfiles/2",
      "owner": "/api/users/1",
      "segments": "/api/users/1/tracks/2/segments",
      "thumbnail": "/thumbnails/7b932aa4-2f5f-48b0-971c-dbff4d20aeb1.png"
    },
    "max_speed": 0.0,
    "moving_time": 89.0,
    "stopped_time": 162.0,
    "thumbnail": "7b932aa4-2f5f-48b0-971c-dbff4d20aeb1",
    "time_end": "2007-10-14T10:14:08",
    "time_start": "2007-10-14T10:09:57",
    "title": "Example gpx",
    "total_downhill": 3.0,
    "total_uphill": 3.0,
    "user_id": 1
  }
]
```

##### `GET` `/api/users/<user_id>/tracks/<track_id>`: Get user track

```
$ curl -i http://localhost:5000/api/users/1/tracks/1 -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTMsIm5iZiI6MTYwMDQyNjk1MywianRpIjoiMzZhMjBkOTktNmI0NS00YzVkLWI4OTgtZWFlNDAwMDk3NzI3IiwiZXhwIjoxNjAwNDI3ODUzLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.eAywpLZhwrzAOASB7s4Pmrj_eFOOh0GMYYY2Q-hTfLM'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 778
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:33 GMT

{
  "activity_mode": 1,
  "avg_speed": 3.0769410345863024,
  "gpxfile_id": 1,
  "id": 1,
  "length2d": 117.8943998190882,
  "length3d": 118.20254402707839,
  "links": {
    "delete": "/api/users/1/tracks/1",
    "download": "/api/users/1/gpxfiles/1/download/example.gpx",
    "file": "/api/users/1/gpxfiles/1",
    "owner": "/api/users/1",
    "segments": "/api/users/1/tracks/1/segments",
    "thumbnail": "/thumbnails/303c8c62-0491-47a4-be1c-50a2f65e6295.png"
  },
  "max_speed": 0.0,
  "moving_time": 89.0,
  "stopped_time": 162.0,
  "thumbnail": "303c8c62-0491-47a4-be1c-50a2f65e6295",
  "time_end": "2007-10-14T10:14:08",
  "time_start": "2007-10-14T10:09:57",
  "title": "Example gpx",
  "total_downhill": 3.0,
  "total_uphill": 3.0,
  "user_id": 1
}
```

##### `PUT` `/api/users/<user_id>/tracks/<track_id>`: Update user track

Change track `title` or `activity_mode`.

```
$ curl -i http://localhost:5000/api/users/1/tracks/1 -X PUT -d '{"activity_mode": 1, "title": "New track title"}' -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTMsIm5iZiI6MTYwMDQyNjk1MywianRpIjoiMzZhMjBkOTktNmI0NS00YzVkLWI4OTgtZWFlNDAwMDk3NzI3IiwiZXhwIjoxNjAwNDI3ODUzLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.eAywpLZhwrzAOASB7s4Pmrj_eFOOh0GMYYY2Q-hTfLM'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 782
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:33 GMT

{
  "activity_mode": 1,
  "avg_speed": 3.0769410345863024,
  "gpxfile_id": 1,
  "id": 1,
  "length2d": 117.8943998190882,
  "length3d": 118.20254402707839,
  "links": {
    "delete": "/api/users/1/tracks/1",
    "download": "/api/users/1/gpxfiles/1/download/example.gpx",
    "file": "/api/users/1/gpxfiles/1",
    "owner": "/api/users/1",
    "segments": "/api/users/1/tracks/1/segments",
    "thumbnail": "/thumbnails/303c8c62-0491-47a4-be1c-50a2f65e6295.png"
  },
  "max_speed": 0.0,
  "moving_time": 89.0,
  "stopped_time": 162.0,
  "thumbnail": "303c8c62-0491-47a4-be1c-50a2f65e6295",
  "time_end": "2007-10-14T10:14:08",
  "time_start": "2007-10-14T10:09:57",
  "title": "New track title",
  "total_downhill": 3.0,
  "total_uphill": 3.0,
  "user_id": 1
}
```

##### `DELETE` `/api/users/<user_id>/tracks/<track_id>`: Delete user track

```
$ curl -i http://localhost:5000/api/users/1/tracks/1 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTMsIm5iZiI6MTYwMDQyNjk1MywianRpIjoiMzZhMjBkOTktNmI0NS00YzVkLWI4OTgtZWFlNDAwMDk3NzI3IiwiZXhwIjoxNjAwNDI3ODUzLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.eAywpLZhwrzAOASB7s4Pmrj_eFOOh0GMYYY2Q-hTfLM'
```

```http
HTTP/1.0 204 NO CONTENT
Content-Type: text/html; charset=utf-8
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:33 GMT

```

### Track Segments

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /api/users/<user_id>/tracks/<track_id>/segments | Get track GPS coordinates |

##### `GET` `/api/users/<user_id>/tracks/<track_id>/segments`: Get track GPS coordinates

```
$ curl -i http://localhost:5000/api/users/1/tracks/3/segments -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDA0MjY5NTMsIm5iZiI6MTYwMDQyNjk1MywianRpIjoiMzZhMjBkOTktNmI0NS00YzVkLWI4OTgtZWFlNDAwMDk3NzI3IiwiZXhwIjoxNjAwNDI3ODUzLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.eAywpLZhwrzAOASB7s4Pmrj_eFOOh0GMYYY2Q-hTfLM'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 363
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Fri, 18 Sep 2020 11:02:33 GMT

[
  [
    [
      46.57608333,
      8.89241667
    ],
    [
      46.57619444,
      8.89252778
    ],
    [
      46.57641667,
      8.89266667
    ],
    [
      46.5765,
      8.89280556
    ],
    [
      46.57638889,
      8.89302778
    ],
    [
      46.57652778,
      8.89322222
    ],
    [
      46.57661111,
      8.89344444
    ]
  ]
]
```
