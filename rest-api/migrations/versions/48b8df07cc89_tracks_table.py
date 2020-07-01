"""tracks table

Revision ID: 48b8df07cc89
Revises: ba29ca77dbc3
Create Date: 2020-07-01 17:06:46.099845

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '48b8df07cc89'
down_revision = 'ba29ca77dbc3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('track',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('gpxfile_id', sa.Integer(), nullable=True),
    sa.Column('title', sa.String(length=255), nullable=True),
    sa.Column('time_start', sa.DateTime(), nullable=True),
    sa.Column('time_end', sa.DateTime(), nullable=True),
    sa.Column('length2d', sa.Float(), nullable=True),
    sa.Column('length3d', sa.Float(), nullable=True),
    sa.Column('max_speed', sa.Float(), nullable=True),
    sa.Column('avg_speed', sa.Float(), nullable=True),
    sa.Column('total_uphill', sa.Float(), nullable=True),
    sa.Column('total_downhill', sa.Float(), nullable=True),
    sa.Column('moving_time', sa.Float(), nullable=True),
    sa.Column('stopped_time', sa.Float(), nullable=True),
    sa.ForeignKeyConstraint(['gpxfile_id'], ['gpxfile.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('track')
    # ### end Alembic commands ###
