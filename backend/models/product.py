from flask import Blueprint, jsonify, request
from services.product_service import (
    get_all_products,
    create_new_product
)

products_bp = Blueprint('products', __name__)

@products_bp.route('/api/products', methods=['GET'])
def get_products():

    produtos = get_all_products()

    return jsonify(produtos)


@products_bp.route('/api/products', methods=['POST'])
def create_product():

    data = request.get_json()

    create_new_product(data)

    return jsonify({
        "message": "Produto criado com sucesso"
    })