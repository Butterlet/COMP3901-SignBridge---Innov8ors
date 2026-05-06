from flask import Blueprint, request, jsonify
from flask_login import login_user
from .models import User
from . import db
from datetime import datetime

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    jsl_level = data.get('jsl_level')

    # Basic validation
    if not email or not password or len(password) < 6:
        return jsonify({'message': 'Invalid input'}), 400

    # Check if user already exists
    existing_user = db.find_user_by_email(email)  # implement this
    if existing_user:
        return jsonify({'message': 'Email already registered'}), 409

    # Hash the password
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Create user in database
    new_user = db.create_user({
        'username': email,
        'email': email,
        'password_hash': hashed.decode('utf-8'),
        'first_name': first_name,
        'last_name': last_name,
        'jsl_level': jsl_level,
        'created_at': datetime.utcnow()
    })

    # Create a session (so user is logged in automatically)
    session['user_id'] = new_user['id']
    session.permanent = True

    return jsonify({
        'message': 'User created successfully',
        'user': {
            'id': new_user['id'],
            'email': email,
            'jsl_level': jsl_level
        }
    }), 201