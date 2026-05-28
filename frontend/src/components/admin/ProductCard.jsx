import "../../styles/admin/cards.css";

function ProductCard({ product, onDelete }) {

    return (

        <div className="product-card">

            <img
                src={product.imagem}
                alt={product.nome}
            />

            <div className="product-info">

                <h3>{product.nome}</h3>

                <p>{product.descricao}</p>

                <span className="price">
                    {product.preco}€
                </span>

                <span className="stock">
                    Stock: {product.stock}
                </span>

            </div>

            <div className="product-actions">

                <button className="edit-btn">
                    Editar
                </button>

                <button
                    className="delete-btn"
                    onClick={() => onDelete(product.id)}
                >
                    Apagar
                </button>

            </div>

        </div>
    );
}

export default ProductCard;