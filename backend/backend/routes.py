from flask import Blueprint, request, jsonify
from flask_login import login_user
from .models import User
from . import db
from datetime import datetime

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.json

    # 1. Required fields check
    required_fields = ["first_name", "last_name", "date_of_birth", "jsl_level", "username", "email", "password"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    # 2. Password length
    if len(data["password"]) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    # 3. Email format
    import re
    email_pattern = r"[^@]+@[^@]+\.[^@]+"
    if not re.match(email_pattern, data["email"]):
        return jsonify({"error": "Invalid email format"}), 400

    # 4. JSL level restriction
    valid_levels = ["Beginner", "Intermediate", "Advanced"]
    if data["jsl_level"] not in valid_levels:
        return jsonify({"error": "Invalid JSL level"}), 400

    # 5. Convert date string to Python date
    from datetime import datetime
    try:
        dob = datetime.strptime(data['date_of_birth'], "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Date of birth must be YYYY-MM-DD"}), 400

    # 6. Check if username/email already exists
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already taken"}), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 400

    # If all checks pass, create user
    user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        date_of_birth=dob,
        jsl_level=data['jsl_level'],
        username=data['username'],
        email=data['email']
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Account created successfully!"})


@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify({"message": "Login successful!"})
    return jsonify({"message": "Invalid credentials"}), 401

@auth.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to SignBridge backend!"})

from flask_login import login_required, current_user

@auth.route('/profile', methods=['GET'])
@login_required
def profile():
    return jsonify({
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "username": current_user.username,
        "date_of_birth": str(current_user.date_of_birth), # convert date
        "jsl_level": current_user.jsl_level,
        "email": current_user.email
    })

