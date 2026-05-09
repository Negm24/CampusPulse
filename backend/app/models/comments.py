from app.extensions import db
from datetime import datetime

class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.String(128), primary_key=True)

    post_id = db.Column(db.String(128), db.ForeignKey('posts.id'), nullable=False)
    author_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)

    content = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "author_id": self.author_id,
            "content": self.content,
            "timestamp": self.created_at.strftime("%b %d, %I:%M %p")
        }
    
    @staticmethod
    def generate_comment_id(author_id, post_id):
        # Prefix 'C-' + author prefix + post suffix + timestamp
        return "C-" + str(author_id[:3]) + "-" + str(post_id[-8:]) + "-" + str(int(datetime.now().timestamp()))