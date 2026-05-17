from flask import Flask
from .extensions import db, jwt, migrate
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    

    from app.models import group_user, groups, users, posts  # Temporarily import models to ensure they are registered with SQLAlchemy

    # Load configuration from config.py
    app.config.from_object("config.Config")

    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://192.168.1.*:3000", "https://172.20.10.*:3000"]  # localhost + local networks
            }}, supports_credentials=True)

    # Initialize extensions with this app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Blueprints registrations imported here to avoid circular imports...
    from app.routes.auth import auth_bp
    # app.register_blueprint(test_bp)
    app.register_blueprint(auth_bp)

    from app.routes.groups_management import groups_management_bp
    app.register_blueprint(groups_management_bp)

    from app.routes.parent_protected import parent_protected_bp
    app.register_blueprint(parent_protected_bp)

    from app.routes.posts_management import posts_bp
    app.register_blueprint(posts_bp)

    from app.routes.settings import settings_bp
    app.register_blueprint(settings_bp)

    return app
