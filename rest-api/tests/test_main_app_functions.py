import os
from tempfile import TemporaryDirectory

from app import create_directory_if_necessary


def test_create_directory_if_necessary():
    with TemporaryDirectory() as tmp_dir:
        dirname = os.path.join(tmp_dir, "test")
        assert os.path.exists(dirname) == False
        create_directory_if_necessary(dirname)
        assert os.path.exists(dirname)
        assert os.path.isdir(dirname)
        assert os.stat(dirname).st_mode & 0o700 == 0o700
