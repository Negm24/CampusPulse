from app import db
import secrets
import hashlib
from datetime import datetime

def generate_group_user_id():
    return f"MBR-{secrets.token_hex(3).upper()}"

class GroupUser(db.Model):
    __tablename__ = 'groups_users'

    id = db.Column(db.String(64), primary_key=True, default=generate_group_user_id)

    group_id = db.Column(db.String(32), db.ForeignKey('groups.id', ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    role = db.Column(db.String(20), default='student')  # 'instructor' or 'student'

    joined_at = db.Column(db.DateTime, server_default=db.func.now())

    groups = db.relationship('Group', back_populates='members')
    user = db.relationship('User', back_populates='group_memberships')

    @staticmethod
    def generate_group_user_id(g_id, u_id):
        # GRP-ECE-3SUN-3204-1B3C----AM-Y05-N03218887     <-- subject_code[:2] - periodday[:2] - subject_code[3:] - TIMEHASH ---- user_id
        time_hash = hashlib.sha1(str(datetime.now().timestamp()).encode()).hexdigest()[-4:].upper()
        return (
            "GU" + '-' +
            str(g_id) + '----' +
            str(u_id) + '-' +
            str(time_hash)
        )
