"""
App factory module: create and configure the Flask application,
initialize extensions and register blueprints.
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from config import Config
import os 

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()

def create_app():
    
    """
    Create and configure the Flask app.
    """

    # Initialize Flask application
    app = Flask(__name__)

    # Load configuration from config.py
    app.config.from_object(Config)

    # Create upload folder if not exist already
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    # Set the login view for Flask-Login
    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'info'

    # Register blueprints
    from app.routes import auth, main

    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(main.main_bp)

    # Create the database tables if they do not exist
    with app.app_context():
        db.create_all()

    return app