import numpy as np
from flask import current_app, send_from_directory
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
from matplotlib.image import imsave

from app.thumbnails import bp


# Deliver a thumbnail. This should just be a fallback for development and
# ideally the web server should serve the images.
@bp.route("/<filename>", methods=["GET"])
def get_thumbnail(filename):
    return send_from_directory(current_app.config["THUMBNAILS_FOLDER"], filename)


def create_thumbnail(track, gpx_track):
    content = generate_thumbnail_content(gpx_track)
    imsave(track.thumbnail_path(), arr=content, format="png")


def generate_thumbnail_content(gpx_track):
    fig = Figure(figsize=(1, 1), dpi=128, facecolor="white", linewidth=2, tight_layout=True)
    canvas = FigureCanvasAgg(fig)
    ax = fig.add_subplot(aspect="equal")
    ax.set_axis_off()

    for segment in gpx_track.segments:
        lat = []
        long = []
        for point in segment.points:
            lat.append(point.latitude)
            long.append(point.longitude)
        ax.plot(long, lat, color="blue")

    canvas.draw()
    return np.asarray(canvas.buffer_rgba())
