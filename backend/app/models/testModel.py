from app.extensions import db

class Ping(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(50), nullable=False)