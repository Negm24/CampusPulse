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
    
    login_value = data.get("identifier")
    password = data.get("password")

    if not login_value or not password:
        return jsonify({"error": "Identifier and password are required!"}), 400
    
    if "@" in login_value:
        login_key = "email"
    elif login_value.isdigit():
        login_key = "phone"
    else:
        login_key = "username"

    user = User.query.filter_by(**{login_key: login_value}).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    expires = timedelta(days=3) if data.get("isRememberMe") == True else timedelta(hours=1)
    if expires == timedelta(hours=1):
        print("User did not trigger remember me")
    if expires == timedelta(days=3):
        print("User triggered remember me")
    access_token = create_access_token(identity=user.id, expires_delta=expires)

    id1_value = ""
    id1_key = ""
    id2_value = ""
    id2_key = ""
    if login_key == "email":
        id1_value = user.username
        id1_key = "username"
        id2_value = user.phone
        id2_key = "phone"
    elif login_key == "phone":
        id1_value = user.username
        id1_key = "username"
        id2_value = user.email
        id2_key = "email"
    else:
        id1_value = user.email
        id1_key = "email"
        id2_value = user.phone
        id2_key = "phone"


    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user_id": user.id,
        id1_key: id1_value,
        id2_key: id2_value,
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



# ------------------------------Verification-Section-------------------------------------


verification_codes = {}             # <-- Dictionary to store verification codes in memory
                                    # In production, consider to use a better solution for persistence like Redis or a database...

# Example structure for verification codes
# {
#   "negm@example.com": {               <-- Email as key
#     "code": "462819",                 <-- Verification code
#     "timestamp": datetime.now()       <-- Timestamp of when the code was sent
#   }
# }

import smtplib
from email.message import EmailMessage

def send_verification_email(to_email, code):
    msg = EmailMessage()
    msg["Subject"] = "Your Verification Code"
    msg["From"] = "youssefkhalednegm24@gmail.com"
    msg["To"] = to_email
    msg.set_content(f"Your verification code is: {code}")

    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
        smtp.starttls()
        smtp.login("youssefkhalednegm24@gmail.com", "ryde gkdz aoyq qxug")  # Is this should be my own password?
        smtp.send_message(msg)

    # OR

    # with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
    #     smtp.login("youssefkhalednegm24@gmail.com", "ryde gkdz aoyq qxug")
    #     smtp.send_message(msg)


import random

@auth_bp.route("/send_code", methods=["POST"])
def send_code():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    code = str(random.randint(100000, 999999))

    verification_codes[email] = {
        "code": code,
        "timestamp": datetime.now()
    }

    try:
        send_verification_email(email, code)
        return jsonify({"message": "Verification code sent"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500
    

@auth_bp.route("/verify_code", methods=["POST"])
def verify_code():
    data = request.get_json()
    email = data.get("email")
    user_code = data.get("code")

    if not email or not user_code:
        return jsonify({"error": "Email and code are required"}), 400

    record = verification_codes.get(email)
    if not record:
        return jsonify({"error": "No code found for this email"}), 404

    if datetime.now() - record["timestamp"] > timedelta(minutes=5):
        return jsonify({"error": "Code expired"}), 400

    if record["code"] != user_code:
        return jsonify({"error": "Invalid code"}), 401

    # Verified successfully
    del verification_codes[email]  # Optional cleanup
    return jsonify({"verified": True}), 200
