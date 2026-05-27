from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from models.user import User
from database.db import bcrypt, db

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/api/login', methods=['POST'])
def login():

    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:

        return jsonify({
            "success": False,
            "error": "Email e password obrigatórios."
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user:

        return jsonify({
            "success": False,
            "error": "Credenciais inválidas."
        }), 401

    valid_password = bcrypt.check_password_hash(
        user.password,
        password
    )

    if not valid_password:

        return jsonify({
            "success": False,
            "error": "Credenciais inválidas."
        }), 401

    token = create_access_token(
        identity=user.id
    )

    return jsonify({
        "success": True,
        "token": token,
        "email": user.email
    })
