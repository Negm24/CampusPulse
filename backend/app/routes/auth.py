from flask import Blueprint, request, jsonify
from app.models.users import User
from app.extensions import db
from datetime import datetime, timedelta

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
    
# -------------------------------------------------------------------

from flask_jwt_extended import create_access_token

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not data.get("password"):
        return jsonify({"error": "Password is required!"}), 400
    
    login_filelds = ["username", "email", "phone"]
    login_key = next((key for key in login_filelds if key in data), None)

    if not login_key:
        return jsonify({"error": "Username, email, or phone is required!"}), 400
    
    login_value = data[login_key]
    password = data["password"]

    user = User.query.filter(
        (getattr(User, login_key) == login_value)
    ).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user_id": user.id
    }), 200

# -------------------------------------------------------------------

from flask_jwt_extended import jwt_required, get_jwt_identity

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "gender": user.gender,
        "birthdate": user.birthdate.strftime("%Y-%m-%d") if user.birthdate else None,
        "created_at": user.created_at.strftime("%Y-%m-%d")
    }), 200

# -------------------------------------------------------------------