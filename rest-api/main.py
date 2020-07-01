from app import create_app, db
from app.models import User, GPXFile, Track, user_schema, track_schema


app = create_app()


@app.shell_context_processor
def make_shell_context():
    return {"db": db,
            "User": User, "GPXFile": GPXFile, "Track": Track,
            "user_schema": user_schema, "track_schema": track_schema}
