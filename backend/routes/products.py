from flask import Blueprint, jsonify, request
import psycopg2

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


# CRIAR PRODUTO
@products_bp.route('/api/products', methods=['POST'])
def create_product():

    data = request.get_json()

    conn = psycopg2.connect(
        host="postgres",
        database="meninadahorta",
        user="admin",
        password="superpassword123"
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
