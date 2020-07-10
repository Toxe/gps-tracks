import os
from flask import current_app, url_for
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import Schema, fields, validate
from datetime import datetime
from sqlalchemy import event


class User(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), index=True, unique=True)
    email    = db.Column(db.String(128), index=True, unique=True)
    password = db.Column(db.String(128))
    gpxfiles = db.relationship("GPXFile", backref="owner", lazy="dynamic", cascade="all,delete,delete-orphan")
    tracks   = db.relationship("Track", backref="owner", lazy="dynamic", cascade="all,delete,delete-orphan")
    def set_password(self, password):
        self.password = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password, password)
    def __repr__(self):
        return "<User:{} {}>".format(self.id, self.username)


class GPXFile(db.Model):
    __tablename__ = "gpxfile"
    id            = db.Column(db.Integer, primary_key=True)
    user_id       = db.Column(db.Integer, db.ForeignKey("user.id"))
    filename      = db.Column(db.String(255))
    time_imported = db.Column(db.DateTime, default=datetime.utcnow)
    tracks        = db.relationship("Track", backref="file", lazy="dynamic", cascade="all,delete,delete-orphan")
    def static_file_path(self):
        return os.path.join(current_app.config["GPXFILES_FOLDER"], "{}.gpx".format(self.id))
    def delete_static_file(self):
        filename = self.static_file_path()
        if os.path.isfile(filename):
            os.remove(filename)
    def __repr__(self):
        return "<GPXFile:{}>".format(self.id)


# automatically remove the physical GPX file after a GPXFile database entry has been deleted
@event.listens_for(GPXFile, "after_delete")
def gpxfile_after_delete(mapper, connection, gpxfile):
    gpxfile.delete_static_file()


class Track(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    user_id        = db.Column(db.Integer, db.ForeignKey("user.id"))
    gpxfile_id     = db.Column(db.Integer, db.ForeignKey("gpxfile.id"))
    title          = db.Column(db.String(255))
    time_start     = db.Column(db.DateTime)
    time_end       = db.Column(db.DateTime)
    length2d       = db.Column(db.Float)
    length3d       = db.Column(db.Float)
    max_speed      = db.Column(db.Float)
    avg_speed      = db.Column(db.Float)
    total_uphill   = db.Column(db.Float)
    total_downhill = db.Column(db.Float)
    moving_time    = db.Column(db.Float)
    stopped_time   = db.Column(db.Float)
    def __repr__(self):
        return "<Track:{} gpxfile={}>".format(self.id, self.gpxfile_id)


class UserSchema(Schema):
    id       = fields.Int(validate=validate.Range(min=1), missing=0)
    username = fields.Str(required=True, validate=validate.Length(min=2))
    email    = fields.Str(required=True, validate=validate.Email(), load_only=True)
    password = fields.Str(required=True, validate=validate.Length(min=4), load_only=True)
    links    = fields.Method("dump_links")
    def dump_links(self, obj):
        return {
            "gpxfiles": url_for("api.get_user_gpxfiles", user_id=obj.id),
            "tracks": url_for("api.get_user_tracks", user_id=obj.id),
        }


class GPXFileSchema(Schema):
    id            = fields.Integer(required=True)
    user_id       = fields.Integer(required=True)
    filename      = fields.String(required=True)
    time_imported = fields.DateTime(required=True)
    links         = fields.Method("dump_links")
    def dump_links(self, obj):
        return {
            "owner": url_for("api.get_user", id=obj.user_id),
        }


class TrackSchema(Schema):
    id             = fields.Integer(required=True)
    user_id        = fields.Integer(required=True)
    gpxfile_id     = fields.Integer(required=True)
    title          = fields.String(required=True)
    time_start     = fields.DateTime(required=True)
    time_end       = fields.DateTime(required=True)
    length2d       = fields.Float(required=True)
    length3d       = fields.Float(required=True)
    max_speed      = fields.Float(required=True)
    avg_speed      = fields.Float(required=True)
    total_uphill   = fields.Float(required=True)
    total_downhill = fields.Float(required=True)
    moving_time    = fields.Float(required=True)
    stopped_time   = fields.Float(required=True)
    links          = fields.Method("dump_links")
    def dump_links(self, obj):
        return {
            "owner": url_for("api.get_user", id=obj.user_id),
            "file": url_for("api.get_user_gpxfile", user_id=obj.user_id, gpxfile_id=obj.gpxfile_id),
        }


user_schema = UserSchema()
gpxfile_schema = GPXFileSchema()
track_schema = TrackSchema()
