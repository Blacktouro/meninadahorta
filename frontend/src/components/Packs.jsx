import '../styles/packs.css'
import { useCart } from '../context/CartContext'

function Packs() {
    const { addToCart } = useCart()

    const packs = [
        {
            nome: "Pack Família",
            tipo: "Pack",
            descricao: "Carvão + vinho + cerveja para um churrasco em família.",
            detalhes: [
                "1 saco de carvão",
                "1 garrafa de vinho",
                "6 cervejas"
            ],
            preco: 29,
            destaque: "Mais popular"
        },
        {
            nome: "Pack Futebol",
            tipo: "Pack",
            descricao: "24 cervejas + carvão para ver o jogo com os amigos.",
            detalhes: [
                "24 cervejas",
                "1 saco de carvão",
                "Ideal para convívios"
            ],
            preco: 35,
            destaque: "Para grupos"
        },
        {
            nome: "Pack Premium",
            tipo: "Pack",
            descricao: "Vinho premium + cervejas + carvão vegetal de qualidade.",
            detalhes: [
                "1 vinho premium",
                "Cervejas selecionadas",
                "Carvão vegetal"
            ],
            preco: 49,
            destaque: "Premium"
        }
    ]

    return (
        <section id="packs" className="packs-section">
            <div className="container">

                <span className="packs-label">
                    Packs mais pedidos
                </span>

                <h2 className="packs-title">
                    Escolhe o teu pack 🔥
                </h2>

                <p className="packs-subtitle">
                    Combinações pensadas para churrascos, futebol, festas e convívios de última hora.
                </p>

                <div className="packs-grid">
                    {packs.map((pack, index) => (
                        <div className="pack-card" key={index}>

                            <div className="pack-top">
                                <span>#{index + 1}</span>
                                <small>{pack.destaque}</small>
                            </div>

                            <h3>{pack.nome}</h3>

                            <p>{pack.descricao}</p>

                            <ul className="pack-list">
                                {pack.detalhes.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>

                            <div className="pack-price">
                                <strong>{pack.preco.toFixed(2)}€</strong>
                                <small>Entrega calculada depois</small>
                            </div>

                            <button
                                className="pack-btn"
                                onClick={() => addToCart(pack)}
                            >
                                Adicionar ao carrinho
                            </button>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Packs
