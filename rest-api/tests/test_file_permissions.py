from os import F_OK, R_OK, W_OK, access


def test_gpxfiles_folder_exists_and_is_readable_and_writable(app):
    assert access(app.config["GPXFILES_FOLDER"], F_OK | R_OK | W_OK) is True


def test_thumbnails_folder_exists_and_is_readable_and_writable(app):
    assert access(app.config["THUMBNAILS_FOLDER"], F_OK | R_OK | W_OK) is True
