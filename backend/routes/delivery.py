from flask import Blueprint, request, jsonify
import requests
import os

delivery_bp = Blueprint('delivery', __name__)

ORS_API_KEY = os.getenv("ORS_API_KEY")

BASE_ADDRESS = os.getenv(
    "BASE_ADDRESS",
    "Beco do Aterro S/N, 2525-792 Peniche, Portugal"
)

BASE_LAT = os.getenv("BASE_LAT")
BASE_LNG = os.getenv("BASE_LNG")

# mete aqui TODO o teu código:
# geocode_address
# get_origin_coordinates
# get_destination_coordinates
# get_distance_km
# calculate_delivery_fee
# calcular_entrega

from flask import Blueprint, jsonify, request

from services.delivery_service import (
    process_delivery_calculation
)

delivery_bp = Blueprint('delivery', __name__)

@delivery_bp.route("/api/calcular-entrega", methods=["POST"])
def calcular_entrega():

    response = process_delivery_calculation(
        request.get_json()
    )

    return jsonify(response)