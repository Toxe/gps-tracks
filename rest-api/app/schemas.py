from flask import url_for
from app.models import ActivityMode
from marshmallow import Schema, fields, validate


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


class TrackSchema(Schema):
    id               = fields.Integer(required=True)
    user_id          = fields.Integer(required=True)
    gpxfile_id       = fields.Integer(required=True)
    gpxfile_track_id = fields.Integer(required=True)
    title            = fields.String(required=True)
    time_start       = fields.DateTime(required=True)
    time_end         = fields.DateTime(required=True)
    length2d         = fields.Float(required=True)
    length3d         = fields.Float(required=True)
    max_speed        = fields.Float(required=True)
    avg_speed        = fields.Float(required=True)
    total_uphill     = fields.Float(required=True)
    total_downhill   = fields.Float(required=True)
    moving_time      = fields.Float(required=True)
    stopped_time     = fields.Float(required=True)
    activity_mode    = fields.Integer(required=True, validate=validate.OneOf([e.value for e in ActivityMode]))
    links            = fields.Method("dump_links")
    def dump_links(self, obj):
        return {
            "owner": url_for("api.get_user", user_id=obj.user_id),
            "file": url_for("api.get_user_gpxfile", user_id=obj.user_id, gpxfile_id=obj.gpxfile_id),
        }


class GPXFileSchema(Schema):
    id            = fields.Integer(required=True)
    user_id       = fields.Integer(required=True)
    filename      = fields.String(required=True)
    time_imported = fields.DateTime(required=True)
    tracks        = fields.List(fields.Nested(TrackSchema))
    links         = fields.Method("dump_links")
    def dump_links(self, obj):
        return {
            "owner": url_for("api.get_user", user_id=obj.user_id),
        }


user_schema = UserSchema()
gpxfile_schema = GPXFileSchema()
track_schema = TrackSchema()
