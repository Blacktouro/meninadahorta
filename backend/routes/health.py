from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__)

@health_bp.route("/")
def home():

    return jsonify({
        "status": "Backend online"
    })


@health_bp.route("/api/health")
def health():

    return jsonify({
        "success": True,
        "message": "API Menina da Horta online"
    })