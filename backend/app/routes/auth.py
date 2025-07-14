from flask import Blueprint, request, jsonify
from app.models.users import User
from app.extensions import db
from datetime import datetime

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    required_fields = [
        "username", "email", "phone", "password", "role", 
        "first_name", "last_name", "gender", "birthdate"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        birthdate = datetime.strptime(data["birthdate"], "%Y-%m-%d")

        custom_id = User.generate_custom_id(
            role=data["role"],
            gender=data["gender"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            birthdate=birthdate,
            phone=data["phone"]
        )

        # Check if username/email/phone/id already exist
        existing_user = User.query.filter(
            (User.username == data["username"]) |
            (User.email == data["email"]) |
            (User.phone == data["phone"]) |
            (User.id == custom_id)
        ).first()

        if existing_user:
            return jsonify({"error": "User already exists (username/email/phone/id taken)"}), 409

        new_user = User(
            id=custom_id,
            username=data["username"],
            email=data["email"],
            phone=data["phone"],
            role=data["role"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            gender=data["gender"],
            birthdate=birthdate
        )
        new_user.set_password(data["password"])

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "User registered successfully",
            "user_id": new_user.id
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @auth_bp.route("/login", methods=["POST"])
# def login():
#     data = request.get_json()

#     if not data or "username" not in data or "password" not in data:
#         return jsonify({"error": "Username and password are required"}), 400

#     user = User.query.filter_by(username=data["username"]).first()

#     if user and user.check_password(data["password"]):
#         # Here you would typically generate a JWT token
#         return jsonify({
#             "message": "Login successful",
#             "user_id": user.id,
#             "role": user.role
#         }), 200

#     return jsonify({"error": "Invalid username or password"}), 401

