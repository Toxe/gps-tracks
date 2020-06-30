import pytest
from app import create_app


@pytest.fixture
def app():
    app = create_app()
    app.testing = True

    with app.app_context():
        yield app
