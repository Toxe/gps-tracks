import os


def create_empty_file(filename):
    open(filename, "w").close()


def directory_is_empty(dirname):
    return len(os.listdir(dirname)) == 0
