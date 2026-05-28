
from flask import (
    Blueprint,
    jsonify,
    request,
    current_app,
    send_from_directory
)

import psycopg2
import os

from werkzeug.utils import secure_filename

products_bp = Blueprint('products', __name__)

# LISTAR PRODUTOS
@products_bp.route('/api/products', methods=['GET'])
def get_products():

    conn = psycopg2.connect(
        host="postgres",
        database="meninadahorta",
        user="admin",
        password="superpassword123"
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

# SERVIR IMAGENS
@products_bp.route('/uploads/products/<filename>')
def uploaded_file(filename):

    return send_from_directory(
        current_app.config['UPLOAD_FOLDER'],
        filename
    )

# CRIAR PRODUTO
@products_bp.route('/api/products', methods=['POST'])
def create_product():

    imagem = request.files.get("imagem")

    filename = None
    imagem_url = None

    # UPLOAD IMAGEM
    if imagem:

        filename = secure_filename(imagem.filename)

        filepath = os.path.join(
            current_app.config['UPLOAD_FOLDER'],
            filename
        )

        imagem.save(filepath)

        imagem_url = f"/uploads/products/{filename}"

    nome = request.form.get("nome")
    descricao = request.form.get("descricao")
    preco = request.form.get("preco")
    categoria_id = request.form.get("categoria_id")
    stock = request.form.get("stock")
    destaque = request.form.get("destaque")

    slug = nome.lower().replace(" ", "-")

    conn = psycopg2.connect(
        host="postgres",
        database="meninadahorta",
        user="admin",
        password="superpassword123"
    )

    cur = conn.cursor()

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
        nome,
        slug,
        descricao,
        preco,
        categoria_id,
        imagem_url,
        stock,
        destaque
    ))

    conn.commit()

    cur.close()
    conn.close()

    return jsonify({
        "message": "Produto criado com sucesso"
    })

