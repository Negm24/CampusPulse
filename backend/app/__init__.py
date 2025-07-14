from flask import Flask
from .extensions import db, jwt, migrate

def create_app():
    app = Flask(__name__)

    from app import models  # Temporarily import models to ensure they are registered with SQLAlchemy

    # Load configuration from config.py
    app.config.from_object("config.Config")

    # Initialize extensions with this app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Blueprints will be registered later
    from app.routes.auth import auth_bp
    # app.register_blueprint(test_bp)
    app.register_blueprint(auth_bp)


    return app
