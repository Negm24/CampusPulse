from random import randint
import hashlib
from datetime import datetime
from app.extensions import db
from cryptography.fernet import Fernet

ENCRYPTION_KEY = "gjGVQcC9qja1tR44XYdXSGgysIKHdCMk4j4y6dpGdpQ="
fernet = Fernet(ENCRYPTION_KEY.encode())

class Group(db.Model):

    __tablename__ = 'groups'

    id = db.Column(db.String(32), primary_key=True)
    subject_code = db.Column(db.String(20), nullable=False)
    subject_name = db.Column(db.String(100), nullable=False)
    day = db.Column(db.Enum("Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", name="subject_day"), nullable=True)         # e.g., "Monday"
    period = db.Column(db.Enum("1", "2", "3", "4", "5", "6", "7", "8"), nullable=True)      # e.g., "1, 2, 3, 4, 5, 6, 7, 8"
    join_code = db.Column(db.String(256), unique=True)

    created_by = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    members = db.relationship('GroupUser', back_populates='groups', cascade='all, delete', passive_deletes=True)

    @staticmethod
    def generate_join_code():
        code_arr = []
        f_type = ["char", "int"]

        chars = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ"
        ints = "0123456789"

        for i in range(1, 6):
            shuffle_type = f_type[randint(0, 1)]

            if shuffle_type == "char":
                code_arr.append(chars[randint(0, len(chars) - 1)])
            else:
                code_arr.append(ints[randint(0, len(ints) - 1)])

        return "".join(code_arr)



    @staticmethod
    def generate_group_id(subject_code, subject_name, day, period):
        # GRP-ECE-3SUN-3204-1B3C     <-- subject_code[:2] - periodday[:2] - subject_code[3:] - TIMEHASH
        time_hash = hashlib.sha1(str(datetime.now().timestamp()).encode()).hexdigest()[-4:].upper()
        return (
            "GRP" + '-' +
            str(subject_code[:3]) + '-' +
            str(period) + str(day[:3]).upper() + '-' +
            str(subject_name[0]) + str(subject_code[3:]) + '-' +
            str(time_hash)
        )
    
    def set_join_code(self, code):
        self.join_code = fernet.encrypt(code.encode()).decode()

    def get_join_code(self):
        return fernet.decrypt(self.join_code.encode()).decode()

    def check_join_code(self, input_code):
        try:
            return self.get_join_code() == input_code
        except:
            return False
        

# d6822 <-- (code el join bta3 group el oop)... 5alibalkkkk el join error 'groups' idk eda baa shofha...