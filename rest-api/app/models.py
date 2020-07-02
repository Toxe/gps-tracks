from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import Schema, fields, validate
from datetime import datetime


class User(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), index=True, unique=True)
    email    = db.Column(db.String(128), index=True, unique=True)
    password = db.Column(db.String(128))
    gpxfiles = db.relationship("GPXFile", backref="owner", lazy="dynamic")
    tracks   = db.relationship("Track", backref="owner", lazy="dynamic")
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
    tracks        = db.relationship("Track", backref="file", lazy="dynamic")
    def __repr__(self):
        return "<GPXFile:{}>".format(self.id)


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


class GPXFileSchema(Schema):
    id            = fields.Integer(required=True)
    user_id       = fields.Integer(required=True)
    filename      = fields.String(required=True)
    time_imported = fields.DateTime(required=True)


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


user_schema = UserSchema()
gpxfile_schema = GPXFileSchema()
track_schema = TrackSchema()
