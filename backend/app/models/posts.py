from app.extensions import db
from datetime import datetime

class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.String(128), primary_key=True)

    group_id = db.Column(db.String(50), db.ForeignKey('groups.id'), nullable=False)
    author_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)

    content = db.Column(db.Text, nullable=True)
    post_type = db.Column(db.Enum('material', 'announcement', 'assignment'), name='type')
    attachment = db.Column(db.String(255), nullable=True) # filename/URL if there is a PDF

    created_at = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {
            "id": self.id,
            "group_id": self.group_id,
            "author_id": self.author_id,
            "content": self.content,
            "type": self.post_type,
            "attachment": self.attachment,
            # Formats the datetime object into a string like: "Oct 24, 8:00 AM"
            "timestamp": self.created_at.strftime("%b %d, %I:%M %p") 
        }
    
    @staticmethod
    def generate_post_id(author_id, post_type, group_id):
        # Pauthur_id[0:3] + type + group_id[4:11] + group_id[17:]
        return "P" + '-' + str(author_id[:3]) + '-' + str(post_type[0].upper()) + '-' + str(group_id[4:11]) + '-' + str(group_id[17:]) + '-' + str(int(datetime.now().timestamp()))