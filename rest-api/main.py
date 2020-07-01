from app import create_app, db
from app.models import User, GPXFile, user_schema


app = create_app()


@app.shell_context_processor
def make_shell_context():
    return {"db": db,
            "User": User, "GPXFile": GPXFile,
            "user_schema": user_schema}
