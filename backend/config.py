import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database
    # Sanestefano Home Local Network:
    # SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL_SAN", "")

    # Gleem Home Local Network:
    # SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL_GLEEM", "")
    
    # LocalHost Network:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL_LOCAL", "")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key")