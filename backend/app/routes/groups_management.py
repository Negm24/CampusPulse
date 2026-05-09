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
    input_join_code = data.get('join_code')
    user_id = data.get('user_id')

    if not input_join_code or not user_id:
        return jsonify({"error": "Missing join code or user ID"}), 400
    
    try:
        # 1. Find the group by decrypting and checking the Fernet join codes.
        # We cannot use SQL filter_by because Fernet strings are unique per encryption.
        all_groups = groups.Group.query.all()
        target_group = None
        
        for group in all_groups:
            # This uses your built-in decryption method!
            if group.check_join_code(input_join_code):
                target_group = group
                break
                
        if not target_group:
            return jsonify({"error": "Invalid group code or group not found"}), 404

        # 2. Check the user and their role
        user = users.User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        if user.role == "admin":
            return jsonify({"error": "Admin cannot join groups"}), 403

        # 3. Check if they are already enrolled using the group ID we just found
        existing_membership = group_user.GroupUser.query.filter_by(
            group_id=target_group.id, user_id=user_id
        ).first()

        if existing_membership:
            return jsonify({"message": "You are already in this group"}), 200

        # 4. Create the new membership with your custom ID generator
        if user.role == "student":
            new_user_in_group = group_user.GroupUser(
                id=group_user.GroupUser.generate_group_user_id(target_group.id, user_id),
                group_id=target_group.id,
                user_id=user_id
                # Role defaults to student/member based on your model
            )
        else: # For instructors joining other groups
            new_user_in_group = group_user.GroupUser(
                id=group_user.GroupUser.generate_group_user_id(target_group.id, user_id),
                group_id=target_group.id,
                user_id=user_id,
                role="instructor" 
            )
            
        db.session.add(new_user_in_group)
        db.session.commit()
        
        return jsonify({"message": f"{user.first_name} joined {target_group.subject_name} successfully"}), 200

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


@groups_management_bp.route('/get_all_enrolled_groups/<u_id>', methods=['GET'])
def get_all_enrolled_groups(u_id):
    try:
        user = users.User.query.get(u_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        if user.role == "admin":
            return jsonify({"groups": [], "message": "Admins cannot join groups"}), 202

        enrolled_groups = group_user.GroupUser.query.filter_by(user_id=u_id).all()

        if not enrolled_groups:
             return jsonify({"groups": [], "message": "No groups enrolled"}), 201

        groups_data = []
        for enrollment in enrolled_groups:
            group = groups.Group.query.get(enrollment.group_id)
            
            if group:
                instructor = users.User.query.get(group.created_by)
                if instructor:
                    instructor_name = f"{instructor.first_name} {instructor.last_name}"
                else:
                    instructor_name = "Unknown Instructor"

                # Format perfectly to match the React GroupCard props
                groups_data.append({
                    "id": group.id,
                    "subject_code": group.subject_code,
                    "subject_name": group.subject_name,
                    "instructor": instructor_name,
                    "day": group.day,
                    "created_at": group.created_at.strftime("%Y-%m-%d")
                })

        return jsonify({"groups": groups_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@groups_management_bp.route('/<group_id>/members', methods=['GET'])
def get_group_members(group_id):
    try:
        # Join the GroupUser table with the User table to get names
        memberships = db.session.query(users.User, group_user.GroupUser.role)\
            .join(group_user.GroupUser, users.User.id == group_user.GroupUser.user_id)\
            .filter(group_user.GroupUser.group_id == group_id).all()

        members_list = []
        for user_obj, role in memberships:
            members_list.append({
                "first_name": user_obj.first_name,
                "last_name": user_obj.last_name,
                # If they have a specific role in the group use that, otherwise fallback to their main account role
                "role": role if role else user_obj.role 
            })

        return jsonify({"members": members_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500