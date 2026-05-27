import { useState } from 'react'
import { useCart } from '../context/CartContext'
import '../styles/hero.css'

function Hero() {

    const [modalAberto, setModalAberto] = useState(false)

    const { addToCart, setCartOpen } = useCart()

    const packsMaisVendidos = [
        {
            id: 1,
            nome: 'Pack Churrasco Família',
            descricao: 'Carvão + vinho + cervejas para um churrasco em família.',
            preco: 29.90,
            imagem: '/images/pack-familia.jpg'
        },
        {
            id: 2,
            nome: 'Pack Convívio',
            descricao: 'Cervejas frescas + carvão + extras para juntar os amigos.',
            preco: 34.90,
            imagem: '/images/pack-convivio.jpg'
        },
        {
            id: 3,
            nome: 'Pack Premium',
            descricao: 'Vinho selecionado + cervejas + carvão vegetal premium.',
            preco: 49.90,
            imagem: '/images/pack-premium.jpg'
        }
    ]

    const adicionarPackCarrinho = (pack) => {

        addToCart({
            id: pack.id,
            nome: pack.nome,
            preco: pack.preco,
            imagem: pack.imagem,
            quantidade: 1
        })

        setModalAberto(false)
        
    }

    return (
        <>
            {/* HERO */}
            <section className="hero">

                <div className="hero-overlay">

                    <div className="container hero-content">

                        <span className="hero-badge">
                            🚚 Entrega rápida em Peniche e arredores
                        </span>

                        <h1>
                            Tudo para o teu churrasco, sem sair de casa
                        </h1>

                        <p>
                            Vinhos, cervejas, carvão e packs especiais preparados para convívios, festas e churrascos de última hora.
                        </p>

                        <div className="hero-actions">

                            <button
                                className="hero-btn primary"
                                onClick={() => setModalAberto(true)}
                            >
                                Pedir Agora
                            </button>

                            <a
                                href="#packs"
                                className="hero-btn secondary"
                            >
                                Ver Packs
                            </a>

                        </div>

                    </div>

                </div>

            </section>

            {/* MODAL */}
            {modalAberto && (

                <div className="packs-modal-backdrop">

                    <div className="packs-modal">

                        <button
                            className="modal-close"
                            onClick={() => setModalAberto(false)}
                        >
                            ×
                        </button>

                        <span className="modal-label">
                            🔥 Mais vendidos
                        </span>

                        <h2>
                            Escolhe o teu pack
                        </h2>

                        <p className="modal-subtitle">
                            Adiciona rapidamente ao carrinho e finaliza a encomenda.
                        </p>

                        <div className="modal-packs-grid">

                            {packsMaisVendidos.map((pack) => (

                                <div
                                    className="modal-pack-card"
                                    key={pack.id}
                                >

                                    <div className="modal-pack-image">

                                        <img
                                            src={pack.imagem}
                                            alt={pack.nome}
                                        />

                                    </div>

                                    <div className="modal-pack-content">

                                        <h3>
                                            {pack.nome}
                                        </h3>

                                        <p>
                                            {pack.descricao}
                                        </p>

                                        <strong>
                                            {pack.preco.toFixed(2)}€
                                        </strong>

                                        <button
                                            className="modal-pack-btn"
                                            onClick={() => adicionarPackCarrinho(pack)}
                                        >
                                            🛒 Adicionar ao Carrinho
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            )}
        </>
    )
}

export default Hero