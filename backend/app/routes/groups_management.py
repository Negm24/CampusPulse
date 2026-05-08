from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import users, group_user, groups
from datetime import datetime

groups_management_bp = Blueprint('groups', __name__, url_prefix="/groups")

@groups_management_bp.route('/create', methods=['POST'])
def create_group():
    data = request.get_json()

    try:
        creator = users.User.query.filter_by(id=data['created_by']).first()

        if not creator:
            return jsonify({"Error": "User ID did not pass correctly!"})
        if creator.role != "instructor":
            return jsonify({"error": "Only instructors can create groups"}), 403

        custom_id = groups.Group.generate_group_id(
            subject_code=data['subject_code'],
            subject_name=data['subject_name'],
            day=data['day'],
            period=data['period']
        )

        counter = 0
        while True:
            join_code = groups.Group.generate_join_code()
            existing_groups = groups.Group.query.all()
            collision = any(group.check_join_code(join_code) for group in existing_groups)
            print("collision is:", collision, "\n" + "counter:", counter)
            counter+=1
            if not collision:
                break


        new_group = groups.Group(
            id=custom_id,
            subject_code=data['subject_code'],
            subject_name=data['subject_name'],
            day=data['day'],
            period=data['period'],
            join_code=join_code,
            created_by=data['created_by']
        )
        new_group.set_join_code(join_code)

        db.session.add(new_group)

        group_user_join = group_user.GroupUser(
            id=group_user.GroupUser.generate_group_user_id(custom_id, creator.id),
            group_id=custom_id,
            user_id=creator.id,
            role="instructor"
        )
        db.session.add(group_user_join)


        db.session.commit()

        return jsonify({
            "message": "Group created successfully",
            "group_id": new_group.id,
            "created_by": creator.id,
            "join_code": join_code
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"Ma3aras": str(e)}), 500


@groups_management_bp.route('/join', methods=['POST'])
def join_group():
    data = request.get_json()
    try:
        if not data or not data.get("join_code"):
            return jsonify({"error": "Group code is required"}), 400

        group = groups.Group.query.filter_by(id=data.get("group_id")).first()
        if not group:
            return jsonify({"error": "Group not found"}), 404

        if not group.check_join_code(data["join_code"]):
            return jsonify({"error": "Invalid group code"}), 403

        user_id = data.get("user_id")
        user = users.User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        existing_membership = group_user.GroupUser.query.filter_by(
            group_id=data.get("group_id"), user_id=user_id
        ).first()

        if existing_membership:
            return jsonify({"message": "You are already in this group"}), 200

        print(user.role)
        if user.role == "student":
            new_user_in_group = group_user.GroupUser(
                id=group_user.GroupUser.generate_group_user_id(data.get('group_id'), user_id),
                group_id=data.get('group_id'),
                user_id=user_id
            )
        elif user.role == "admin":
            return jsonify({"Error": "Admin cannot join groups"}), 403
        else:
            new_user_in_group = group_user.GroupUser(
                id=group_user.GroupUser.generate_group_user_id(data.get('group_id'), user_id),
                group_id=data.get('group_id'),
                user_id=user_id,
                role="instructor"
            )
        db.session.add(new_user_in_group)
        db.session.commit()
        return jsonify({"message": f"{user.first_name} joined {group.subject_name} group successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@groups_management_bp.route('/get_code/<id>', methods=['GET'])
def get_code(id):
    try:
        group = groups.Group.query.get(id)
        if not group:
            return jsonify({"error": "Group not found"}), 404
        join_code = group.get_join_code()
        return jsonify({"join_code": join_code}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# @groups_management_bp.route('/get_all_enrolled_groups/<U_id>', methods=['GET'])
# def get_all_enrolled_groups(u_id):
#     try:
#         user = users.User.query.get(u_id)
#         if not user:
#             return jsonify({"Error": "User not found"}), 404
#         enrolled_groups = group_user.GroupUser.query.filter_by(user_id=u_id).all()

#         groups = [enrollment.groups for enrollment in enrolled_groups]