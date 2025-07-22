from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

parent_protected_bp = Blueprint("parent_protected", __name__, url_prefix="/protected")

@parent_protected_bp.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    current_user_id = get_jwt_identity()
    return jsonify({"valid": True, "user_id": current_user_id}), 200
