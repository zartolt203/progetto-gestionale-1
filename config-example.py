"""
Application configuration settings for Flask, database, and other services.
"""

import os
from dotenv import load_dotenv

load_dotenv()
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:

    # --- Security ---
    SECRET_KEY = "EXAMPLE"

    # --- Admin Password ---
    ADMIN_PASSWORD = "EXAMPLE"

    # --- Database ---
    SQLALCHEMY_DATABASE_URI = os.getenv(
    "DATABASE_URL",
    "sqlite:///instance/app.db"  # fallback
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # --- File Uploads ---
    UPLOAD_FOLDER = os.path.join(basedir, 'app', 'static', 'uploads', 'colli')
