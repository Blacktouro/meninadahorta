from datetime import datetime
from database.db import db

class Product(db.Model):

    __tablename__ = 'products'

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    nome = db.Column(
        db.String(255),
        nullable=False
    )

    descricao = db.Column(
        db.Text
    )

    preco = db.Column(
        db.Float,
        nullable=False
    )

    categoria = db.Column(
        db.String(120)
    )

    imagem = db.Column(
        db.String(500)
    )

    stock = db.Column(
        db.Integer,
        default=0
    )

    ativo = db.Column(
        db.Boolean,
        default=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )
