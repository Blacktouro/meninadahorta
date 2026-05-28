import psycopg2

DB_CONFIG = {
    "host": "postgres",
    "database": "meninadahorta",
    "user": "admin",
    "password": "TUA_PASSWORD"
}

def get_connection():

    return psycopg2.connect(**DB_CONFIG)


def get_all_products():

    conn = get_connection()
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

    return produtos


def create_new_product(data):

    conn = get_connection()
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