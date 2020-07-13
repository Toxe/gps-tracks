# GPS Tracks

## Dependencies

- Python REST API:
  - Python 3.7+
  - Flask
  - Flask-JWT-Extended
  - Flask-SQLAlchemy
  - Flask-Migrate
  - flask-shell-ipython
  - Marshmallow
  - SQLAlchemy
  - SQLite
  - python-dotenv
  - pytest
  - pylint
  - pylint-flask
  - pylint-flask-sqlalchemy
  - Click
  - Wheel
  - IPython
  - gpxpy

## Setup local development version

Python virtualenv:

```
$ cd rest-api
$ python3 -m venv venv
$ source venv/bin/activate
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

## Run REST API server

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

### Open Flask CLI context

Run IPython shell and execute application commands.

```
$ flask shell
>>> u = User(username="Test", email="test@example.com")
>>> u
<User Test>
>>> db.session.add(u)
>>> db.session.commit()
```

### Example data

Create a new database with example data:

```
$ flask db upgrade
$ flask shell
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
Endpoint                   Methods  Rule
-------------------------  -------  --------------------------------------------------
api.get_users              GET      /api/users
api.create_user            POST     /api/users
api.get_user               GET      /api/users/<int:id>
api.update_user            PUT      /api/users/<int:user_id>
api.delete_user            DELETE   /api/users/<int:user_id>
api.get_user_gpxfiles      GET      /api/users/<int:user_id>/gpxfiles
api.upload_user_gpxfile    POST     /api/users/<int:user_id>/gpxfiles
api.get_user_gpxfile       GET      /api/users/<int:user_id>/gpxfiles/<int:gpxfile_id>
api.delete_user_gpxfile    DELETE   /api/users/<int:user_id>/gpxfiles/<int:gpxfile_id>
api.get_user_tracks        GET      /api/users/<int:user_id>/tracks
api.get_user_track         GET      /api/users/<int:user_id>/tracks/<int:track_id>
api.delete_user_track      DELETE   /api/users/<int:user_id>/tracks/<int:track_id>
auth.login                 POST     /auth/login
auth.logout_access_token   DELETE   /auth/logout
auth.logout_refresh_token  DELETE   /auth/logout2
auth.refresh               POST     /auth/refresh
static                     GET      /static/<path:filename>
```

## REST API

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

```
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 568
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiOGQ5ZTY0YjctNGE2NS00MDYwLTlkNzktZjFmODg5ODAyMTY3IiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.BarHDBSkQ5e6htaC9U-e_8ExiknXHhSnHMbbGBdMnqE",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiMzkwYzhlZmYtZmRkMi00M2NlLTkzNDYtOTQ0NzdhMDc2NmI1IiwiZXhwIjoxNTk3MjM1Mzc0LCJpZGVudGl0eSI6MSwidHlwZSI6InJlZnJlc2gifQ.Bc2XrnF-jJA6qokTkSyZMYzAxS7bDrry_R4sBs3zUBc"
}
```

##### `POST` `/auth/refresh`: Refresh access token

```
$ curl -i http://localhost:5000/auth/refresh -X POST -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiMzkwYzhlZmYtZmRkMi00M2NlLTkzNDYtOTQ0NzdhMDc2NmI1IiwiZXhwIjoxNTk3MjM1Mzc0LCJpZGVudGl0eSI6MSwidHlwZSI6InJlZnJlc2gifQ.Bc2XrnF-jJA6qokTkSyZMYzAxS7bDrry_R4sBs3zUBc'
```

```
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 293
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiZTc2NzhiZGUtYTNkNS00MDViLTgwMDgtNzExOWM2YTgzYWMyIiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.xZRlgNcsCx4J7Wo2aGLwypz5ryQAfnz4B_iZc09Na9w"
}
```

##### `DELETE` `/auth/logout`: Logout and revoke access token

```
$ curl -i http://localhost:5000/auth/logout -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiZTc2NzhiZGUtYTNkNS00MDViLTgwMDgtNzExOWM2YTgzYWMyIiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.xZRlgNcsCx4J7Wo2aGLwypz5ryQAfnz4B_iZc09Na9w'
```

```
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 44
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

{
  "message": "Successfully logged out."
}
```

##### `DELETE` `/auth/logout2`: Logout and revoke refresh token

```
$ curl -i http://localhost:5000/auth/logout2 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiMzkwYzhlZmYtZmRkMi00M2NlLTkzNDYtOTQ0NzdhMDc2NmI1IiwiZXhwIjoxNTk3MjM1Mzc0LCJpZGVudGl0eSI6MSwidHlwZSI6InJlZnJlc2gifQ.Bc2XrnF-jJA6qokTkSyZMYzAxS7bDrry_R4sBs3zUBc'
```

```
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 44
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

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

```
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 308
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

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

```
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 135
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

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

```
HTTP/1.0 201 CREATED
Content-Type: application/json
Content-Length: 138
Location: http://localhost:5000/api/users/3
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

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
$ curl -i http://localhost:5000/api/users/3 -X PUT -d '{"username": "Shiny new username", "email": "new@example.com", "password": "different password"}' -H 'Content-Type: application/json' -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiYzg4YWViYTQtNmEwZi00Y2FmLTg4OGEtZmUzYjA4MjQwNDdkIiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MywiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.SBej38BM61hJtwy_SXzQ7U91B-WXx6dnJw2kh8QM0Gk'
```

```
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 148
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

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
$ curl -i http://localhost:5000/api/users/3 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiYzg4YWViYTQtNmEwZi00Y2FmLTg4OGEtZmUzYjA4MjQwNDdkIiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MywiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.SBej38BM61hJtwy_SXzQ7U91B-WXx6dnJw2kh8QM0Gk'
```

```
HTTP/1.0 204 NO CONTENT
Content-Type: text/html; charset=utf-8
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT
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
$ curl -i http://localhost:5000/api/users/1/gpxfiles -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiZDJmZjRmY2EtMjY2YS00YTQ1LThmOTAtNWRiYTk4MTVlYTY1IiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.498L8muYcpTxVoNQUd3uzNQ7Ol843F_g3sZf3U0owSw'
```

```
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 2101
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

[
  {
    "filename": "GPXFile 01",
    "id": 1,
    "links": {
      "owner": "/api/users/1"
    },
    "time_imported": "2020-07-13T12:29:28.997778",
    "tracks": [
      {
        "avg_speed": 10.0,
        "gpxfile_id": 1,
        "id": 1,
        "length2d": 1000.0,
        "length3d": 1000.0,
        "links": {
          "file": "/api/users/1/gpxfiles/1",
          "owner": "/api/users/1"
        },
        "max_speed": 20.0,
        "moving_time": 300.0,
        "stopped_time": 0.0,
        "time_end": "2020-07-13T12:34:28.999225",
        "time_start": "2020-07-13T12:29:28.999223",
        "title": "Track 01",
        "total_downhill": 50.0,
        "total_uphill": 50.0,
        "user_id": 1
      },
      {
        "avg_speed": 10.0,
        "gpxfile_id": 1,
        "id": 2,
        "length2d": 1000.0,
        "length3d": 1000.0,
        "links": {
          "file": "/api/users/1/gpxfiles/1",
          "owner": "/api/users/1"
        },
        "max_speed": 20.0,
        "moving_time": 300.0,
        "stopped_time": 0.0,
        "time_end": "2020-07-13T12:34:28.999474",
        "time_start": "2020-07-13T12:29:28.999473",
        "title": "Track 02",
        "total_downhill": 50.0,
        "total_uphill": 50.0,
        "user_id": 1
      }
    ],
    "user_id": 1
  },
  {
    "filename": "GPXFile 02",
    "id": 2,
    "links": {
      "owner": "/api/users/1"
    },
    "time_imported": "2020-07-13T12:29:28.997783",
    "tracks": [
      {
        "avg_speed": 10.0,
        "gpxfile_id": 2,
        "id": 3,
        "length2d": 1000.0,
        "length3d": 1000.0,
        "links": {
          "file": "/api/users/1/gpxfiles/2",
          "owner": "/api/users/1"
        },
        "max_speed": 20.0,
        "moving_time": 300.0,
        "stopped_time": 0.0,
        "time_end": "2020-07-13T12:34:28.999657",
        "time_start": "2020-07-13T12:29:28.999656",
        "title": "Track 03",
        "total_downhill": 50.0,
        "total_uphill": 50.0,
        "user_id": 1
      }
    ],
    "user_id": 1
  }
]
```

##### `GET` `/api/users/<user_id>/gpxfiles/<gpxfile_id>`: Get user GPX file

```
$ curl -i http://localhost:5000/api/users/1/gpxfiles/1 -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiZDJmZjRmY2EtMjY2YS00YTQ1LThmOTAtNWRiYTk4MTVlYTY1IiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.498L8muYcpTxVoNQUd3uzNQ7Ol843F_g3sZf3U0owSw'
```

```
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 1229
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

{
  "filename": "GPXFile 01",
  "id": 1,
  "links": {
    "owner": "/api/users/1"
  },
  "time_imported": "2020-07-13T12:29:28.997778",
  "tracks": [
    {
      "avg_speed": 10.0,
      "gpxfile_id": 1,
      "id": 1,
      "length2d": 1000.0,
      "length3d": 1000.0,
      "links": {
        "file": "/api/users/1/gpxfiles/1",
        "owner": "/api/users/1"
      },
      "max_speed": 20.0,
      "moving_time": 300.0,
      "stopped_time": 0.0,
      "time_end": "2020-07-13T12:34:28.999225",
      "time_start": "2020-07-13T12:29:28.999223",
      "title": "Track 01",
      "total_downhill": 50.0,
      "total_uphill": 50.0,
      "user_id": 1
    },
    {
      "avg_speed": 10.0,
      "gpxfile_id": 1,
      "id": 2,
      "length2d": 1000.0,
      "length3d": 1000.0,
      "links": {
        "file": "/api/users/1/gpxfiles/1",
        "owner": "/api/users/1"
      },
      "max_speed": 20.0,
      "moving_time": 300.0,
      "stopped_time": 0.0,
      "time_end": "2020-07-13T12:34:28.999474",
      "time_start": "2020-07-13T12:29:28.999473",
      "title": "Track 02",
      "total_downhill": 50.0,
      "total_uphill": 50.0,
      "user_id": 1
    }
  ],
  "user_id": 1
}
```

##### `POST` `/api/users/<user_id>/gpxfiles`: Upload new GPX file for user

```
$ curl -i http://localhost:5000/api/users/1/gpxfiles -F file=@tests/example.gpx -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiZDJmZjRmY2EtMjY2YS00YTQ1LThmOTAtNWRiYTk4MTVlYTY1IiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.498L8muYcpTxVoNQUd3uzNQ7Ol843F_g3sZf3U0owSw'
```

```
HTTP/1.0 201 CREATED
Content-Type: application/json
Content-Length: 727
Location: http://localhost:5000/api/users/1/gpxfiles/3
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

{
  "filename": "example.gpx",
  "id": 3,
  "links": {
    "owner": "/api/users/1"
  },
  "time_imported": "2020-07-13T12:29:34.897234",
  "tracks": [
    {
      "avg_speed": 3.0769410345863024,
      "gpxfile_id": 3,
      "id": 4,
      "length2d": 117.8943998190882,
      "length3d": 118.20254402707839,
      "links": {
        "file": "/api/users/1/gpxfiles/3",
        "owner": "/api/users/1"
      },
      "max_speed": 0.0,
      "moving_time": 89.0,
      "stopped_time": 162.0,
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
$ curl -i http://localhost:5000/api/users/1/gpxfiles/3 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiZDJmZjRmY2EtMjY2YS00YTQ1LThmOTAtNWRiYTk4MTVlYTY1IiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.498L8muYcpTxVoNQUd3uzNQ7Ol843F_g3sZf3U0owSw'
```

```
HTTP/1.0 204 NO CONTENT
Content-Type: text/html; charset=utf-8
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT
```

### Tracks

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /api/users/<user_id>/tracks | List user tracks |
| GET | /api/users/<user_id>/tracks/<track_id> | Get user track |
| DELETE | /api/users/<user_id>/tracks/<track_id> | Delete user track |

##### `GET` `/api/users/<user_id>/tracks`: List user tracks

```
$ curl -i http://localhost:5000/api/users/1/tracks -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiZDJmZjRmY2EtMjY2YS00YTQ1LThmOTAtNWRiYTk4MTVlYTY1IiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.498L8muYcpTxVoNQUd3uzNQ7Ol843F_g3sZf3U0owSw'
```

```
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 1463
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

[
  {
    "avg_speed": 10.0,
    "gpxfile_id": 1,
    "id": 1,
    "length2d": 1000.0,
    "length3d": 1000.0,
    "links": {
      "file": "/api/users/1/gpxfiles/1",
      "owner": "/api/users/1"
    },
    "max_speed": 20.0,
    "moving_time": 300.0,
    "stopped_time": 0.0,
    "time_end": "2020-07-13T12:34:28.999225",
    "time_start": "2020-07-13T12:29:28.999223",
    "title": "Track 01",
    "total_downhill": 50.0,
    "total_uphill": 50.0,
    "user_id": 1
  },
  {
    "avg_speed": 10.0,
    "gpxfile_id": 1,
    "id": 2,
    "length2d": 1000.0,
    "length3d": 1000.0,
    "links": {
      "file": "/api/users/1/gpxfiles/1",
      "owner": "/api/users/1"
    },
    "max_speed": 20.0,
    "moving_time": 300.0,
    "stopped_time": 0.0,
    "time_end": "2020-07-13T12:34:28.999474",
    "time_start": "2020-07-13T12:29:28.999473",
    "title": "Track 02",
    "total_downhill": 50.0,
    "total_uphill": 50.0,
    "user_id": 1
  },
  {
    "avg_speed": 10.0,
    "gpxfile_id": 2,
    "id": 3,
    "length2d": 1000.0,
    "length3d": 1000.0,
    "links": {
      "file": "/api/users/1/gpxfiles/2",
      "owner": "/api/users/1"
    },
    "max_speed": 20.0,
    "moving_time": 300.0,
    "stopped_time": 0.0,
    "time_end": "2020-07-13T12:34:28.999657",
    "time_start": "2020-07-13T12:29:28.999656",
    "title": "Track 03",
    "total_downhill": 50.0,
    "total_uphill": 50.0,
    "user_id": 1
  }
]
```

##### `GET` `/api/users/<user_id>/tracks/<track_id>`: Get user track

```
$ curl -i http://localhost:5000/api/users/1/tracks/1 -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiZDJmZjRmY2EtMjY2YS00YTQ1LThmOTAtNWRiYTk4MTVlYTY1IiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.498L8muYcpTxVoNQUd3uzNQ7Ol843F_g3sZf3U0owSw'
```

```
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 445
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT

{
  "avg_speed": 10.0,
  "gpxfile_id": 1,
  "id": 1,
  "length2d": 1000.0,
  "length3d": 1000.0,
  "links": {
    "file": "/api/users/1/gpxfiles/1",
    "owner": "/api/users/1"
  },
  "max_speed": 20.0,
  "moving_time": 300.0,
  "stopped_time": 0.0,
  "time_end": "2020-07-13T12:34:28.999225",
  "time_start": "2020-07-13T12:29:28.999223",
  "title": "Track 01",
  "total_downhill": 50.0,
  "total_uphill": 50.0,
  "user_id": 1
}
```

##### `DELETE` `/api/users/<user_id>/tracks/<track_id>`: Delete user track

```
$ curl -i http://localhost:5000/api/users/1/tracks/1 -X DELETE -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ2NDMzNzQsIm5iZiI6MTU5NDY0MzM3NCwianRpIjoiZDJmZjRmY2EtMjY2YS00YTQ1LThmOTAtNWRiYTk4MTVlYTY1IiwiZXhwIjoxNTk0NzE1Mzc0LCJpZGVudGl0eSI6MSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.498L8muYcpTxVoNQUd3uzNQ7Ol843F_g3sZf3U0owSw'
```

```
HTTP/1.0 204 NO CONTENT
Content-Type: text/html; charset=utf-8
Server: Werkzeug/1.0.1 Python/3.8.3
Date: Mon, 13 Jul 2020 12:29:34 GMT
```
