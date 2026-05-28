from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from database.db import db, bcrypt, jwt

from routes.auth import auth_bp
from routes.products import products_bp
from routes.delivery import delivery_bp
from routes.health import health_bp

import os

load_dotenv()

app = Flask(__name__)

# CONFIG
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# CORS
CORS(app)

# INIT
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# BLUEPRINTS
app.register_blueprint(auth_bp)
app.register_blueprint(products_bp)
app.register_blueprint(delivery_bp)
app.register_blueprint(health_bp)

# CREATE TABLES
with app.app_context():
    db.create_all()

# RUN
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000
    )