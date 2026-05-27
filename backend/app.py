from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from models.user import User
from models.product import Product
from database.db import db, bcrypt, jwt
from routes.auth import auth_bp
from flask import Blueprint, jsonify, request
import psycopg2



from routes.products import products_bp


products_bp = Blueprint('products', __name__)


# LISTAR PRODUTOS
@products_bp.route('/api/products', methods=['GET'])
def get_products():

    conn = psycopg2.connect(
        host="postgres",
        database="meninadahorta",
        user="admin",
        password="TUA_PASSWORD"
    )

    cur = conn.cursor()

    cur.execute("""
        SELECT
            p.id,
            p.nome,
            p.slug,
            p.descricao,
            p.preco,
            p.imagem,
            p.stock,
            c.nome as categoria

        FROM products p

        LEFT JOIN categories c
        ON p.categoria_id = c.id

        WHERE p.ativo = TRUE
    """)

    rows = cur.fetchall()

    produtos = []

    for row in rows:

        produtos.append({
            "id": row[0],
            "nome": row[1],
            "slug": row[2],
            "descricao": row[3],
            "preco": float(row[4]),
            "imagem": row[5],
            "stock": row[6],
            "categoria": row[7]
        })

    cur.close()
    conn.close()

    return jsonify(produtos)


# CRIAR PRODUTO
@products_bp.route('/api/products', methods=['POST'])
def create_product():

    data = request.get_json()

    conn = psycopg2.connect(
        host="postgres",
        database="meninadahorta",
        user="admin",
        password="TUA_PASSWORD"
    )

    cur = conn.cursor()

    slug = data['nome'].lower().replace(" ", "-")

    cur.execute("""
        INSERT INTO products
        (
            nome,
            slug,
            descricao,
            preco,
            categoria_id,
            imagem,
            stock,
            destaque
        )

        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        data['nome'],
        slug,
        data['descricao'],
        data['preco'],
        data['categoria_id'],
        data['imagem'],
        data['stock'],
        data['destaque']
    ))

    conn.commit()

    cur.close()
    conn.close()

    return jsonify({
        "message": "Produto criado com sucesso"
    })

import os
import requests

load_dotenv()

app = Flask(__name__)

# CORS
CORS(app)

# CONFIG
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
# REGISTAR BLUEPRINTS
app.register_blueprint(products_bp)
# INIT
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# IMPORTS MODELS
from models.user import User

# ENV
ORS_API_KEY = os.getenv("ORS_API_KEY")

BASE_ADDRESS = os.getenv(
    "BASE_ADDRESS",
    "Beco do Aterro S/N, 2525-792 Peniche, Portugal"
)

BASE_LAT = os.getenv("BASE_LAT")
BASE_LNG = os.getenv("BASE_LNG")


# HOME
@app.route("/")
def home():

    return jsonify({
        "status": "Backend online",
        "base_address": BASE_ADDRESS,
        "ors_configured": bool(ORS_API_KEY),
        "base_coordinates_configured": bool(BASE_LAT and BASE_LNG)
    })


# HEALTH
@app.route("/api/health")
def health():

    return jsonify({
        "success": True,
        "message": "API Menina da Horta online"
    })


# GEOCODE
def geocode_address(address):

    if not ORS_API_KEY:
        raise ValueError("ORS_API_KEY não configurada")

    url = "https://api.openrouteservice.org/geocode/search"

    params = {
        "api_key": ORS_API_KEY,
        "text": address,
        "boundary.country": "PT",
        "size": 1
    }

    response = requests.get(
        url,
        params=params,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    if not data.get("features"):
        return None

    feature = data["features"][0]

    coords = feature["geometry"]["coordinates"]

    return {
        "lng": coords[0],
        "lat": coords[1],
        "label": feature["properties"].get(
            "label",
            address
        )
    }


# ORIGIN
def get_origin_coordinates():

    if BASE_LAT and BASE_LNG:

        return {
            "lat": float(BASE_LAT),
            "lng": float(BASE_LNG),
            "label": BASE_ADDRESS
        }

    return geocode_address(BASE_ADDRESS)


# DESTINATION
def get_destination_coordinates(data, morada):

    destination_lat = data.get("destination_lat")
    destination_lng = data.get("destination_lng")

    if destination_lat is not None and destination_lng is not None:

        return {
            "lat": float(destination_lat),
            "lng": float(destination_lng),
            "label": "Ponto escolhido no mapa"
        }

    return geocode_address(morada)


# DISTANCE
def get_distance_km(origin, destination):

    if not ORS_API_KEY:
        raise ValueError("ORS_API_KEY não configurada")

    url = "https://api.openrouteservice.org/v2/directions/driving-car/json"

    headers = {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
    }

    body = {
        "coordinates": [
            [origin["lng"], origin["lat"]],
            [destination["lng"], destination["lat"]]
        ]
    }

    response = requests.post(
        url,
        json=body,
        headers=headers,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    route = data["routes"][0]["summary"]

    return {
        "distance_km": round(route["distance"] / 1000, 2),
        "duration_min": round(route["duration"] / 60)
    }


# DELIVERY PRICE
def calculate_delivery_fee(distance_km, subtotal):

    if subtotal >= 50 and distance_km <= 5:
        return 0

    if distance_km <= 3:
        return 2.50

    if distance_km <= 6:
        return 3.50

    if distance_km <= 10:
        return 5.00

    if distance_km <= 15:
        return 7.00

    return None


# API DELIVERY
@app.route("/api/calcular-entrega", methods=["POST"])
def calcular_entrega():

    try:

        data = request.get_json(silent=True)

        if not data:

            return jsonify({
                "success": False,
                "error": "Pedido inválido."
            }), 400

        morada = data.get("morada", "").strip()

        try:
            subtotal = float(data.get("subtotal", 0))

        except (TypeError, ValueError):

            return jsonify({
                "success": False,
                "error": "Subtotal inválido."
            }), 400

        if not morada:

            return jsonify({
                "success": False,
                "error": "Morada obrigatória."
            }), 400

        if subtotal < 0:

            return jsonify({
                "success": False,
                "error": "Subtotal inválido."
            }), 400

        origin = get_origin_coordinates()

        destination = get_destination_coordinates(
            data,
            morada
        )

        if not origin:

            return jsonify({
                "success": False,
                "error": "Erro localização loja."
            }), 400

        if not destination:

            return jsonify({
                "success": False,
                "error": "Morada inválida."
            }), 400

        distance_data = get_distance_km(
            origin,
            destination
        )

        distance_km = distance_data["distance_km"]

        duration_min = distance_data["duration_min"]

        delivery_fee = calculate_delivery_fee(
            distance_km,
            subtotal
        )

        response_data = {
            "success": True,
            "distance_km": distance_km,
            "duration_min": duration_min,
            "delivery_fee": delivery_fee,
            "destination_label": destination["label"],
            "destination_lat": destination["lat"],
            "destination_lng": destination["lng"],
            "origin_label": origin["label"],
            "origin_lat": origin["lat"],
            "origin_lng": origin["lng"]
        }

        if delivery_fee is None:

            return jsonify({
                **response_data,
                "total": round(subtotal, 2),
                "message": "Entrega sob consulta."
            })

        total = subtotal + delivery_fee

        return jsonify({
            **response_data,
            "total": round(total, 2),
            "message": "Entrega calculada."
        })

    except requests.exceptions.HTTPError as e:

        status_code = (
            e.response.status_code
            if e.response
            else 500
        )

        return jsonify({
            "success": False,
            "error": f"Erro API mapas: {status_code}"
        }), 500

    except requests.exceptions.Timeout:

        return jsonify({
            "success": False,
            "error": "Timeout API mapas."
        }), 504

    except requests.exceptions.RequestException:

        return jsonify({
            "success": False,
            "error": "Erro comunicação API mapas."
        }), 500

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500



app.register_blueprint(auth_bp)

# CREATE TABLES
with app.app_context():
    db.create_all()


# RUN
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000
    )
