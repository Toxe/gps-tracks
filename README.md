# GPS Tracks

## Dependencies

- Python REST API:
  - Python 3
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
api.update_user            PUT      /api/users/<int:id>
api.delete_user            DELETE   /api/users/<int:id>
api.get_user_gpxfiles      GET      /api/users/<int:user_id>/gpxfiles
api.upload_user_gpxfile    POST     /api/users/<int:user_id>/gpxfiles
api.get_user_gpxfile       GET      /api/users/<int:user_id>/gpxfiles/<int:gpxfile_id>
api.get_user_tracks        GET      /api/users/<int:user_id>/tracks
api.get_user_track         GET      /api/users/<int:user_id>/tracks/<int:track_id>
auth.login                 POST     /auth/login
auth.logout_access_token   DELETE   /auth/logout
auth.logout_refresh_token  DELETE   /auth/logout2
auth.refresh               POST     /auth/refresh
static                     GET      /static/<path:filename>
```
