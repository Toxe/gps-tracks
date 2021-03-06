import os
from datetime import datetime
from enum import IntEnum

from flask import current_app
from sqlalchemy import event
from werkzeug.security import check_password_hash, generate_password_hash

from app import db


class ActivityMode(IntEnum):
    BIKE = 0
    HIKING = 1


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), index=True, unique=True)
    email = db.Column(db.String(128), index=True, unique=True)
    password = db.Column(db.String(128))
    gpxfiles = db.relationship(
        "GPXFile", backref="owner", lazy="dynamic", cascade="all,delete,delete-orphan"
    )
    tracks = db.relationship(
        "Track", backref="owner", lazy="dynamic", cascade="all,delete,delete-orphan"
    )

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f"<User:{self.id} {self.username}>"


class GPXFile(db.Model):
    __tablename__ = "gpxfile"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    filename = db.Column(db.String(255))
    time_imported = db.Column(db.DateTime, default=datetime.utcnow)
    tracks = db.relationship(
        "Track", backref="file", lazy="dynamic", cascade="all,delete,delete-orphan"
    )

    def static_file_path(self):
        return os.path.join(current_app.config["GPXFILES_FOLDER"], f"{self.id}.gpx")

    def delete_static_file(self):
        filename = self.static_file_path()
        if os.path.isfile(filename):
            os.remove(filename)

    def __repr__(self):
        return f"<GPXFile:{self.id}>"


# automatically remove the physical GPX file after a GPXFile database entry has been deleted
@event.listens_for(GPXFile, "after_delete")
def gpxfile_after_delete(mapper, connection, gpxfile):
    gpxfile.delete_static_file()


class Track(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    gpxfile_id = db.Column(db.Integer, db.ForeignKey("gpxfile.id"))
    gpxfile_track_id = db.Column(db.Integer)  # id in GPX file tracks[] list
    title = db.Column(db.String(255))
    time_start = db.Column(db.DateTime)
    time_end = db.Column(db.DateTime)
    length2d = db.Column(db.Float)
    length3d = db.Column(db.Float)
    max_speed = db.Column(db.Float)
    avg_speed = db.Column(db.Float)
    total_uphill = db.Column(db.Float)
    total_downhill = db.Column(db.Float)
    moving_time = db.Column(db.Float)
    stopped_time = db.Column(db.Float)
    activity_mode = db.Column(db.SmallInteger, default=ActivityMode.BIKE.value)
    thumbnail = db.Column(db.String(36))  # UUID

    def thumbnail_path(self):
        return os.path.join(
            current_app.config["THUMBNAILS_FOLDER"], f"{self.thumbnail}.png"
        )

    def delete_thumbnail_file(self):
        filename = self.thumbnail_path()
        if os.path.isfile(filename):
            os.remove(filename)

    def __repr__(self):
        return f"<Track:{self.id} gpxfile={self.gpxfile_id}>"


# automatically remove the physical thumbnail file after a Track database entry has been deleted
@event.listens_for(Track, "after_delete")
def track_after_delete(mapper, connection, track):
    track.delete_thumbnail_file()
