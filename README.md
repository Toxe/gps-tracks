# GPS Tracks

## Dependencies

- Python REST API:
  - Click
  - Flask
  - Flask-JWT-Extended
  - Flask-Migrate
  - flask-shell-ipython
  - Flask-SQLAlchemy
  - gpxpy
  - IPython
  - Marshmallow
  - pylint
  - pylint-flask
  - pylint-flask-sqlalchemy
  - pytest
  - Python 3.7+
  - python-dotenv
  - Requests
  - SQLAlchemy
  - SQLite
  - Wheel
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

## Setup local development version

Python virtualenv:

```
$ cd rest-api
$ python3 -m venv .venv
$ source .venv/bin/activate
```

Install (or upgrade) Python packages in virtualenv:

```
$ pip install -U $(<.pip)
```

## Configuration

### Flask: `.flaskenv` for development and debugging

```ini
FLASK_APP=main
FLASK_ENV=development
```

### Visual Studio Code: `.vscode/settings.json`

```json
{
    "python.linting.pylintArgs": [
        "--load-plugins",
        "pylint-flask"
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
Endpoint                      Methods  Rule
----------------------------  -------  --------------------------------------------------------------------
api.get_users                 GET      /api/users
api.create_user               POST     /api/users
api.get_user                  GET      /api/users/<int:user_id>
api.update_user               PUT      /api/users/<int:user_id>
api.delete_user               DELETE   /api/users/<int:user_id>
api.get_user_gpxfiles         GET      /api/users/<int:user_id>/gpxfiles
api.upload_user_gpxfile       POST     /api/users/<int:user_id>/gpxfiles
api.get_user_gpxfile          GET      /api/users/<int:user_id>/gpxfiles/<int:gpxfile_id>
api.delete_user_gpxfile       DELETE   /api/users/<int:user_id>/gpxfiles/<int:gpxfile_id>
api.get_user_tracks           GET      /api/users/<int:user_id>/tracks
api.get_user_track            GET      /api/users/<int:user_id>/tracks/<int:track_id>
api.delete_user_track         DELETE   /api/users/<int:user_id>/tracks/<int:track_id>
api.get_user_track_segments   GET      /api/users/<int:user_id>/tracks/<int:track_id>/segments
api.get_user_track_thumbnail  GET      /api/users/<int:user_id>/tracks/<int:track_id>/thumbnail/<thumbnail>
auth.login                    POST     /auth/login
auth.logout_access_token      DELETE   /auth/logout
auth.logout_refresh_token     DELETE   /auth/logout2
auth.refresh                  POST     /auth/refresh
static                        GET      /static/<path:filename>
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
Date: Tue, 25 Aug 2020 16:57:41 GMT

{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjEsIm5iZiI6MTU5ODM3NDY2MSwianRpIjoiMzI5NzM3ZTktYzk5NS00ZWU3LThjZTMtY2Y1Y2EyMmU4MzEyIiwiZXhwIjoxNTk4NDQ2NjYxLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.1fEiRnuzAe5aMa-Mamw0q_8iY2O7_6ethidiZUWnEFM",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjEsIm5iZiI6MTU5ODM3NDY2MSwianRpIjoiM2FhNTE3Y2ItZGZjMi00NGJiLWI2NmEtNWM2NmIyYzU5N2NmIiwiZXhwIjoxNjAwOTY2NjYxLCJpZGVudGl0eSI6MSwidHlwZSI6InJlZnJlc2gifQ.ioCIfLdmccPgoiZf9ZaLdcmVqTBVTflRV2x7_6aixn0"
}
```

##### `POST` `/auth/refresh`: Refresh access token

```
$ curl -i http://localhost:5000/auth/refresh -X POST -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjEsIm5iZiI6MTU5ODM3NDY2MSwianRpIjoiM2FhNTE3Y2ItZGZjMi00NGJiLWI2NmEtNWM2NmIyYzU5N2NmIiwiZXhwIjoxNjAwOTY2NjYxLCJpZGVudGl0eSI6MSwidHlwZSI6InJlZnJlc2gifQ.ioCIfLdmccPgoiZf9ZaLdcmVqTBVTflRV2x7_6aixn0'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 293
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:41 GMT

{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjEsIm5iZiI6MTU5ODM3NDY2MSwianRpIjoiZjU2Mzk3OWEtZWM5My00NzdjLTkzZTUtMWE5MzcxZTFhYzgzIiwiZXhwIjoxNTk4NDQ2NjYxLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.HYBITZrUmVkET7acxQfY2e-l5DJYvnTRVGWDkxxMTqs"
}
```

##### `DELETE` `/auth/logout`: Logout and revoke access token

```
$ curl -i http://localhost:5000/auth/logout -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjEsIm5iZiI6MTU5ODM3NDY2MSwianRpIjoiZjU2Mzk3OWEtZWM5My00NzdjLTkzZTUtMWE5MzcxZTFhYzgzIiwiZXhwIjoxNTk4NDQ2NjYxLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.HYBITZrUmVkET7acxQfY2e-l5DJYvnTRVGWDkxxMTqs'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 44
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:41 GMT

{
  "message": "Successfully logged out."
}
```

##### `DELETE` `/auth/logout2`: Logout and revoke refresh token

```
$ curl -i http://localhost:5000/auth/logout2 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjEsIm5iZiI6MTU5ODM3NDY2MSwianRpIjoiM2FhNTE3Y2ItZGZjMi00NGJiLWI2NmEtNWM2NmIyYzU5N2NmIiwiZXhwIjoxNjAwOTY2NjYxLCJpZGVudGl0eSI6MSwidHlwZSI6InJlZnJlc2gifQ.ioCIfLdmccPgoiZf9ZaLdcmVqTBVTflRV2x7_6aixn0'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 44
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:41 GMT

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
Date: Tue, 25 Aug 2020 16:57:41 GMT

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
Date: Tue, 25 Aug 2020 16:57:41 GMT

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
Date: Tue, 25 Aug 2020 16:57:41 GMT

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
$ curl -i http://localhost:5000/api/users/3 -X PUT -d '{"username": "Shiny new username", "email": "new@example.com", "password": "different password"}' -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjEsIm5iZiI6MTU5ODM3NDY2MSwianRpIjoiNzRmZTEzZjYtNzAwYS00NjdhLTg1MjktZTQ1M2I0YmFmZmM2IiwiZXhwIjoxNTk4NDQ2NjYxLCJpZGVudGl0eSI6MywiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.Re8nxcmxOpkHVXC_TYNYZgIjS62xPaltgIdzi6gHblo'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 148
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:41 GMT

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
$ curl -i http://localhost:5000/api/users/3 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjEsIm5iZiI6MTU5ODM3NDY2MSwianRpIjoiNzRmZTEzZjYtNzAwYS00NjdhLTg1MjktZTQ1M2I0YmFmZmM2IiwiZXhwIjoxNTk4NDQ2NjYxLCJpZGVudGl0eSI6MywiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.Re8nxcmxOpkHVXC_TYNYZgIjS62xPaltgIdzi6gHblo'
```

```http
HTTP/1.0 204 NO CONTENT
Content-Type: text/html; charset=utf-8
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:41 GMT

```

### GPX Files

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /api/users/<user_id>/gpxfiles | List user GPX files |
| GET | /api/users/<user_id>/gpxfiles/<gpxfile_id> | Get user GPX file |
| POST | /api/users/<user_id>/gpxfiles | Upload new GPX file for user |
| DELETE | /api/users/<user_id>/gpxfiles/<gpxfile_id> | Delete user GPX file and associated tracks |

##### `GET` `/api/users/<user_id>/gpxfiles`: List user GPX files

```
$ curl -i http://localhost:5000/api/users/1/gpxfiles -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjIsIm5iZiI6MTU5ODM3NDY2MiwianRpIjoiMmM1MTJjODQtYzExYi00NjI4LWE3NTUtNTc4NTE3NWJlOGJkIiwiZXhwIjoxNTk4NDQ2NjYyLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.Ef4s8dyjmJYw9dgdNYz2CAr9IKYvbAIHHRcl6vNXMU0'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 2080
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:42 GMT

[
  {
    "filename": "example.gpx",
    "id": 1,
    "links": {
      "owner": "/api/users/1"
    },
    "time_imported": "2020-08-25T16:57:38.351194",
    "tracks": [
      {
        "activity_mode": 1,
        "avg_speed": 3.0769410345863024,
        "gpxfile_id": 1,
        "id": 1,
        "length2d": 117.8943998190882,
        "length3d": 118.20254402707839,
        "links": {
          "file": "/api/users/1/gpxfiles/1",
          "owner": "/api/users/1",
          "segments": "/api/users/1/tracks/1/segments",
          "thumbnail": "/api/users/1/tracks/1/thumbnail/6e3ef5bb-b809-47bf-a5d7-8c2865433cc2.png"
        },
        "max_speed": 0.0,
        "moving_time": 89.0,
        "stopped_time": 162.0,
        "thumbnail": "6e3ef5bb-b809-47bf-a5d7-8c2865433cc2",
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
      "owner": "/api/users/1"
    },
    "time_imported": "2020-08-25T16:57:38.396403",
    "tracks": [
      {
        "activity_mode": 1,
        "avg_speed": 3.0769410345863024,
        "gpxfile_id": 2,
        "id": 2,
        "length2d": 117.8943998190882,
        "length3d": 118.20254402707839,
        "links": {
          "file": "/api/users/1/gpxfiles/2",
          "owner": "/api/users/1",
          "segments": "/api/users/1/tracks/2/segments",
          "thumbnail": "/api/users/1/tracks/2/thumbnail/607dfbda-6d4c-43f7-a8b4-f44dd8d4eb36.png"
        },
        "max_speed": 0.0,
        "moving_time": 89.0,
        "stopped_time": 162.0,
        "thumbnail": "607dfbda-6d4c-43f7-a8b4-f44dd8d4eb36",
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
$ curl -i http://localhost:5000/api/users/1/gpxfiles/1 -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjIsIm5iZiI6MTU5ODM3NDY2MiwianRpIjoiMmM1MTJjODQtYzExYi00NjI4LWE3NTUtNTc4NTE3NWJlOGJkIiwiZXhwIjoxNTk4NDQ2NjYyLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.Ef4s8dyjmJYw9dgdNYz2CAr9IKYvbAIHHRcl6vNXMU0'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 967
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:42 GMT

{
  "filename": "example.gpx",
  "id": 1,
  "links": {
    "owner": "/api/users/1"
  },
  "time_imported": "2020-08-25T16:57:38.351194",
  "tracks": [
    {
      "activity_mode": 1,
      "avg_speed": 3.0769410345863024,
      "gpxfile_id": 1,
      "id": 1,
      "length2d": 117.8943998190882,
      "length3d": 118.20254402707839,
      "links": {
        "file": "/api/users/1/gpxfiles/1",
        "owner": "/api/users/1",
        "segments": "/api/users/1/tracks/1/segments",
        "thumbnail": "/api/users/1/tracks/1/thumbnail/6e3ef5bb-b809-47bf-a5d7-8c2865433cc2.png"
      },
      "max_speed": 0.0,
      "moving_time": 89.0,
      "stopped_time": 162.0,
      "thumbnail": "6e3ef5bb-b809-47bf-a5d7-8c2865433cc2",
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
$ curl -i http://localhost:5000/api/users/1/gpxfiles -F file=@tests/example.gpx -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjIsIm5iZiI6MTU5ODM3NDY2MiwianRpIjoiMmM1MTJjODQtYzExYi00NjI4LWE3NTUtNTc4NTE3NWJlOGJkIiwiZXhwIjoxNTk4NDQ2NjYyLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.Ef4s8dyjmJYw9dgdNYz2CAr9IKYvbAIHHRcl6vNXMU0'
```

```http
HTTP/1.0 201 CREATED
Content-Type: application/json
Content-Length: 967
Location: http://localhost:5000/api/users/1/gpxfiles/3
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:42 GMT

{
  "filename": "example.gpx",
  "id": 3,
  "links": {
    "owner": "/api/users/1"
  },
  "time_imported": "2020-08-25T16:57:42.064020",
  "tracks": [
    {
      "activity_mode": 1,
      "avg_speed": 3.0769410345863024,
      "gpxfile_id": 3,
      "id": 3,
      "length2d": 117.8943998190882,
      "length3d": 118.20254402707839,
      "links": {
        "file": "/api/users/1/gpxfiles/3",
        "owner": "/api/users/1",
        "segments": "/api/users/1/tracks/3/segments",
        "thumbnail": "/api/users/1/tracks/3/thumbnail/93db60f6-f7af-4341-aa17-a004f538f58f.png"
      },
      "max_speed": 0.0,
      "moving_time": 89.0,
      "stopped_time": 162.0,
      "thumbnail": "93db60f6-f7af-4341-aa17-a004f538f58f",
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

##### `DELETE` `/api/users/<user_id>/gpxfiles/<gpxfile_id>`: Delete user GPX file and associated tracks

```
$ curl -i http://localhost:5000/api/users/1/gpxfiles/3 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjIsIm5iZiI6MTU5ODM3NDY2MiwianRpIjoiMmM1MTJjODQtYzExYi00NjI4LWE3NTUtNTc4NTE3NWJlOGJkIiwiZXhwIjoxNTk4NDQ2NjYyLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.Ef4s8dyjmJYw9dgdNYz2CAr9IKYvbAIHHRcl6vNXMU0'
```

```http
HTTP/1.0 204 NO CONTENT
Content-Type: text/html; charset=utf-8
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:42 GMT

```

### Tracks

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /api/users/<user_id>/tracks | List user tracks |
| GET | /api/users/<user_id>/tracks/<track_id> | Get user track |
| DELETE | /api/users/<user_id>/tracks/<track_id> | Delete user track |

##### `GET` `/api/users/<user_id>/tracks`: List user tracks

```
$ curl -i http://localhost:5000/api/users/1/tracks -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjIsIm5iZiI6MTU5ODM3NDY2MiwianRpIjoiMmM1MTJjODQtYzExYi00NjI4LWE3NTUtNTc4NTE3NWJlOGJkIiwiZXhwIjoxNTk4NDQ2NjYyLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.Ef4s8dyjmJYw9dgdNYz2CAr9IKYvbAIHHRcl6vNXMU0'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 1488
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:42 GMT

[
  {
    "activity_mode": 1,
    "avg_speed": 3.0769410345863024,
    "gpxfile_id": 1,
    "id": 1,
    "length2d": 117.8943998190882,
    "length3d": 118.20254402707839,
    "links": {
      "file": "/api/users/1/gpxfiles/1",
      "owner": "/api/users/1",
      "segments": "/api/users/1/tracks/1/segments",
      "thumbnail": "/api/users/1/tracks/1/thumbnail/6e3ef5bb-b809-47bf-a5d7-8c2865433cc2.png"
    },
    "max_speed": 0.0,
    "moving_time": 89.0,
    "stopped_time": 162.0,
    "thumbnail": "6e3ef5bb-b809-47bf-a5d7-8c2865433cc2",
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
      "file": "/api/users/1/gpxfiles/2",
      "owner": "/api/users/1",
      "segments": "/api/users/1/tracks/2/segments",
      "thumbnail": "/api/users/1/tracks/2/thumbnail/607dfbda-6d4c-43f7-a8b4-f44dd8d4eb36.png"
    },
    "max_speed": 0.0,
    "moving_time": 89.0,
    "stopped_time": 162.0,
    "thumbnail": "607dfbda-6d4c-43f7-a8b4-f44dd8d4eb36",
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
$ curl -i http://localhost:5000/api/users/1/tracks/1 -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjIsIm5iZiI6MTU5ODM3NDY2MiwianRpIjoiMmM1MTJjODQtYzExYi00NjI4LWE3NTUtNTc4NTE3NWJlOGJkIiwiZXhwIjoxNTk4NDQ2NjYyLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.Ef4s8dyjmJYw9dgdNYz2CAr9IKYvbAIHHRcl6vNXMU0'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 693
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:42 GMT

{
  "activity_mode": 1,
  "avg_speed": 3.0769410345863024,
  "gpxfile_id": 1,
  "id": 1,
  "length2d": 117.8943998190882,
  "length3d": 118.20254402707839,
  "links": {
    "file": "/api/users/1/gpxfiles/1",
    "owner": "/api/users/1",
    "segments": "/api/users/1/tracks/1/segments",
    "thumbnail": "/api/users/1/tracks/1/thumbnail/6e3ef5bb-b809-47bf-a5d7-8c2865433cc2.png"
  },
  "max_speed": 0.0,
  "moving_time": 89.0,
  "stopped_time": 162.0,
  "thumbnail": "6e3ef5bb-b809-47bf-a5d7-8c2865433cc2",
  "time_end": "2007-10-14T10:14:08",
  "time_start": "2007-10-14T10:09:57",
  "title": "Example gpx",
  "total_downhill": 3.0,
  "total_uphill": 3.0,
  "user_id": 1
}
```

##### `DELETE` `/api/users/<user_id>/tracks/<track_id>`: Delete user track

```
$ curl -i http://localhost:5000/api/users/1/tracks/1 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjIsIm5iZiI6MTU5ODM3NDY2MiwianRpIjoiMmM1MTJjODQtYzExYi00NjI4LWE3NTUtNTc4NTE3NWJlOGJkIiwiZXhwIjoxNTk4NDQ2NjYyLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.Ef4s8dyjmJYw9dgdNYz2CAr9IKYvbAIHHRcl6vNXMU0'
```

```http
HTTP/1.0 204 NO CONTENT
Content-Type: text/html; charset=utf-8
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:42 GMT

```

### Track Segments

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /api/users/<user_id>/tracks/<track_id>/segments | Get track GPS coordinates |

##### `GET` `/api/users/<user_id>/tracks/<track_id>/segments`: Get track GPS coordinates

```
$ curl -i http://localhost:5000/api/users/1/tracks/3/segments -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgzNzQ2NjIsIm5iZiI6MTU5ODM3NDY2MiwianRpIjoiMmM1MTJjODQtYzExYi00NjI4LWE3NTUtNTc4NTE3NWJlOGJkIiwiZXhwIjoxNTk4NDQ2NjYyLCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.Ef4s8dyjmJYw9dgdNYz2CAr9IKYvbAIHHRcl6vNXMU0'
```

```http
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 363
Server: Werkzeug/1.0.1 Python/3.8.5
Date: Tue, 25 Aug 2020 16:57:42 GMT

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
