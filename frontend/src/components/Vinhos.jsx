import '../styles/vinhos.css'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

function Vinhos() {
    const { addToCart } = useCart()
    const [openCard, setOpenCard] = useState(null)

    const toggleDetails = (index) => {
        setOpenCard(openCard === index ? null : index)
    }

    const vinhos = [
        {
            nome: "Vinho Tinto da Casa",
            tipo: "Vinho",
            categoria: "Tinto",
            descricao: "Vinho tinto ideal para acompanhar carnes grelhadas e churrascos.",
            detalhes: "Produzido com uvas selecionadas, apresenta notas suaves de frutos vermelhos e um final equilibrado.",
            preco: 6.90,
            destaque: "Mais vendido",
            imagem: "/images/vinhos/tinto.jpg"
        },
        {
            nome: "Vinho Branco Fresco",
            tipo: "Vinho",
            categoria: "Branco",
            descricao: "Vinho branco leve e fresco, perfeito para peixe, marisco e dias quentes.",
            detalhes: "Aroma cítrico e refrescante, excelente servido bem fresco em dias quentes.",
            preco: 5.90,
            destaque: "Fresco",
            imagem: "/images/vinhos/branco.jpg"
        },
        {
            nome: "Vinho Rosé",
            tipo: "Vinho",
            categoria: "Rosé",
            descricao: "Rosé suave e aromático, excelente para convívios e tardes de verão.",
            detalhes: "Combina notas florais e frutas vermelhas, ideal para petiscos e momentos descontraídos.",
            preco: 6.50,
            destaque: "Verão",
            imagem: "/images/vinhos/rose.jpg"
        },
        {
            nome: "Vinho Tinto Reserva",
            tipo: "Vinho",
            categoria: "Reserva",
            descricao: "Vinho tinto encorpado para quem procura uma opção mais especial.",
            detalhes: "Estágio prolongado que oferece um sabor intenso, elegante e persistente.",
            preco: 11.90,
            destaque: "Premium",
            imagem: "/images/vinhos/reserva.jpg"
        },
        {
            nome: "Vinho Verde",
            tipo: "Vinho",
            categoria: "Verde",
            descricao: "Leve, fresco e perfeito para entradas, petiscos e marisco.",
            detalhes: "Muito refrescante com leve gás natural e excelente acidez.",
            preco: 5.50,
            destaque: "Leve",
            imagem: "/images/vinhos/verde.jpg"
        },
        {
            nome: "Espumante",
            tipo: "Vinho",
            categoria: "Espumante",
            descricao: "Boa opção para festas, brindes e momentos especiais.",
            detalhes: "Bolha fina e sabor elegante, perfeito para celebrações.",
            preco: 9.90,
            destaque: "Festa",
            imagem: "/images/vinhos/espumante.jpg"
        }
    ]

    return (
        <section id="vinhos" className="vinhos-section">
            <div className="container">

                <span className="vinhos-label">
                    Garrafeira
                </span>

                <h2 className="vinhos-title">
                    Vinhos para todos os momentos 🍷
                </h2>

                <p className="vinhos-subtitle">
                    Escolhe os teus vinhos preferidos e adiciona ao carrinho.
                </p>

                <div className="vinhos-grid">
                    {vinhos.map((vinho, index) => (
                        <div className="vinho-card" key={index}>

                            <div className="vinho-image">
                                <img
                                    src={vinho.imagem}
                                    alt={vinho.nome}
                                />
                            </div>

                            <div className="vinho-content">

                                <div className="vinho-top">
                                    <span>{vinho.categoria}</span>
                                    <small>{vinho.destaque}</small>
                                </div>

                                <h3>{vinho.nome}</h3>

                                <p>{vinho.descricao}</p>

                                <div className="vinho-bottom">
                                    <strong>{vinho.preco.toFixed(2)}€</strong>

                                    <button
                                        className="vinho-btn"
                                        onClick={() => addToCart(vinho)}
                                    >
                                        Adicionar
                                    </button>
                                </div>

                                <button
                                    className="vinho-details-btn"
                                    onClick={() => toggleDetails(index)}
                                >
                                    {openCard === index
                                        ? 'Fechar detalhes'
                                        : 'Ver detalhes'}
                                </button>

                                {openCard === index && (
                                    <div className="vinho-details">
                                        <p>{vinho.detalhes}</p>
                                    </div>
                                )}

                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Vinhos