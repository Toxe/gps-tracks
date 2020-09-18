from app import create_app, db
from app.models import GPXFile, Track, User
from app.schemas import gpxfile_schema, track_schema, track_update_schema, user_schema

app = create_app()


@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "User": User,
        "GPXFile": GPXFile,
        "Track": Track,
        "user_schema": user_schema,
        "gpxfile_schema": gpxfile_schema,
        "track_schema": track_schema,
        "track_update_schema": track_update_schema,
    }
