import os

class Config:
    # Database
    # Sanestefano Home Local Network:
    # SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "mysql://root:Yoyoqls_2005@192.168.1.4:3306/campuspulse")

    # Gleem Home Local Network:
    # SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "mysql://root:Yoyoqls_2005@192.168.1.29:3306/campuspulse")
    
    # LocalHost Network:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "mysql://root:Yoyoqls_2005@127.0.0.1:3306/campuspulse")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key")

    # Later: email config, CORS, etc.
