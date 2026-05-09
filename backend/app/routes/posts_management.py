import os
from werkzeug.utils import secure_filename
import time
from flask import current_app
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import posts, users, group_user, groups

# Initialize your new Blueprint
posts_bp = Blueprint('posts', __name__, url_prefix="/posts")

@posts_bp.route('/create', methods=['POST'])
def create_post():
    data = request.get_json()
    try:
        group_id = data.get('group_id')
        author_id = data.get('author_id')
        content = data.get('content')
        post_type = data.get('post_type', 'announcement') # Default to announcement
        # attachment = data.get('attachment', None)

        file = request.files.get('file')
        attachment_filename = None

        if not all([group_id, author_id, content]):
            return jsonify({"error": "group_id, author_id, and content are required"}), 400

        # Verify the group exists
        group = groups.Group.query.get(group_id)
        if not group:
            return jsonify({"error": "Group not found"}), 404

        # Verify the user is actually in this group (Security check!)
        user_in_group = group_user.GroupUser.query.filter_by(group_id=group_id, user_id=author_id).first()
        author = users.User.query.get(author_id)
        
        if not author or not user_in_group or author.role == 'admin':
            return jsonify({"error": "User is not enrolled in this group"}), 403
        

        if file and file.filename != '':
            # Clean the filename of dangerous characters
            safe_filename = secure_filename(file.filename)
            # Add a timestamp so two files named "syllabus.pdf" don't overwrite each other
            attachment_filename = f"{int(time.time())}_{safe_filename}"
            
            # Save it to a folder on your server (e.g., app/static/uploads)
            upload_path = os.path.join(current_app.root_path, 'static', 'uploads')
            os.makedirs(upload_path, exist_ok=True) # Create folder if it doesn't exist
            
            file.save(os.path.join(upload_path, attachment_filename))

        # Generate your custom ID
        post_id = posts.Post.generate_post_id(author_id, post_type, group_id)

        new_post = posts.Post(
            id=post_id,
            group_id=group_id,
            author_id=author_id,
            content=content,
            post_type=post_type,
            attachment=attachment_filename
        )

        db.session.add(new_post)
        db.session.commit()

        post_data = new_post.to_dict()
        post_data['author_name'] = f"{author.first_name} {author.last_name}"

        return jsonify({
            "message": "Post created successfully",
            "post": post_data
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@posts_bp.route('/group/<group_id>/user/<user_id>', methods=['GET'])
def get_group_posts(group_id, user_id):
    try:
        # 1. Security Check
        user = users.User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        user_in_group = group_user.GroupUser.query.filter_by(group_id=group_id, user_id=user_id).first()
        if not user_in_group:
            return jsonify({"error": "Only enrolled users can view this group's stream"}), 403

        group_posts = posts.Post.query.filter_by(group_id=group_id).order_by(posts.Post.created_at.desc()).all()

        stream_data = []
        for post in group_posts:
            post_dict = post.to_dict()
            author = users.User.query.get(post.author_id)
            post_dict['author_name'] = f"{author.first_name} {author.last_name}" if author else "Unknown User"
            stream_data.append(post_dict)

        return jsonify({"stream": stream_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    