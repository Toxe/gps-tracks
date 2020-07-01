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
    def __repr__(self):
        return "<GPXFile:{}>".format(self.id)


class UserSchema(Schema):
    id       = fields.Int(validate=validate.Range(min=1), missing=0)
    username = fields.Str(required=True, validate=validate.Length(min=2))
    email    = fields.Str(required=True, validate=validate.Email(), load_only=True)
    password = fields.Str(required=True, validate=validate.Length(min=4), load_only=True)


user_schema = UserSchema()
