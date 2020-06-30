from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import Schema, fields, validate


class User(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), index=True, unique=True)
    email    = db.Column(db.String(128), index=True, unique=True)
    password = db.Column(db.String(128))

    def __repr__(self):
        return "<User {}>".format(self.username)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class UserSchema(Schema):
    id       = fields.Int(validate=validate.Range(min=1), missing=0)
    username = fields.Str(required=True, validate=validate.Length(min=2))
    email    = fields.Str(required=True, validate=validate.Email(), load_only=True)
    password = fields.Str(required=True, load_only=True)


user_schema = UserSchema()
