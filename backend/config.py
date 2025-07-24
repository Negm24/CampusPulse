import os

class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "mysql://negm:Yoyoqls_2005@192.168.1.4:3306/campuspulse")
    # SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "mysql://negm:Yoyoqls_2005@localhost/campuspulse")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key")

    # Later: email config, CORS, etc.
