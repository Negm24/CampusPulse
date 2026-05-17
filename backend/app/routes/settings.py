from flask import Blueprint, request, jsonify
from app.models import users
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

settings_bp = Blueprint("settings", __name__, url_prefix="/settings")

@settings_bp.route("/update-profile", methods=["PATCH"])
@jwt_required()
def update_profile():
    data = request.get_json()

    current_user_id = get_jwt_identity()
    current_user = users.User.query.get(current_user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404
    
    updated_data = {}
    allowed_fields = ["phone", "username"]

    for field in allowed_fields:
        if field in data:
            if data[field] is not None and str(data[field]).strip() != "":
                setattr(current_user, field, data[field])
                updated_data[field] = data[field]

    if updated_data:
        db.session.commit()
        return jsonify({"message": "Profile updated successfully",
                        "username": f"old: {current_user.username}, new: {data.get('username', current_user.username)}" if "username" in data else "unchanged",
                        "phone": f"old: {current_user.phone}, new: {data.get('phone', current_user.phone)}" if "phone" in data else "unchanged"
                        }), 200
    else:
        return jsonify({"message": "No valid fields to update"}), 400