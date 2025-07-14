from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(32), primary_key=True)  # Custom ID
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    phone = db.Column(db.String(32), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    role = db.Column(db.Enum("student", "instructor", "admin", name="user_roles"), nullable=False)
    first_name = db.Column(db.String(32), nullable=False)
    last_name = db.Column(db.String(32), nullable=False)
    gender = db.Column(db.Enum("male", "female", "other", name="genders"), nullable=False)
    birthdate = db.Column(db.Date, nullable=False)

    created_at = db.Column(db.Date, default=datetime.now)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def generate_custom_id(role, gender, first_name, last_name, birthdate, phone):
        # SM-Y05-N03218887
        return (
            role[0].upper() +
            gender[0].upper() + '-' +
            first_name[0].upper() +
            birthdate.strftime('%y') + '-' +
            last_name[0].upper() +
            phone[-8:]
        )
