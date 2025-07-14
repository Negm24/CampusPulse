from flask import Blueprint, jsonify
from app.extensions import db
from app.models.testModel import Ping

test_bp = Blueprint("test_bp", __name__)

@test_bp.route("/test-db", methods=["GET"])
def test_db():
    try:
        test_entry = Ping(message="Connected!")
        db.session.add(test_entry)
        db.session.commit()
        return jsonify({"success": True, "msg": "Database connection works!"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
