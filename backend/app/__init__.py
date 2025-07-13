from flask import Flask
from .extensions import db, jwt  # <-- We'll create this file in the next step

def create_app():
    app = Flask(__name__)
    
    # Load configuration from config.py
    app.config.from_object("config.Config")

    # Initialize extensions with this app
    db.init_app(app)
    jwt.init_app(app)

    # Blueprints will be registered later

    return app
