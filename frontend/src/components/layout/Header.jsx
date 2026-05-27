import '../../styles/header.css'
import { useCart } from '../../context/CartContext'
import { Link } from 'react-router-dom'

function Header() {

    const { totalItems, setCartOpen } = useCart()

    return (

        <header className="main-header">

            <div className="container header-content">

                {/* LOGO */}
                <a href="#" className="logo-area">

                    <div className="logo-icon">
                        🌿
                    </div>

                    <div className="logo-text">
                        <h2>A Menina</h2>
                        <span>da Horta</span>
                    </div>

                </a>

                {/* MENU */}
                <nav className="desktop-nav">

                    <a href="#">
                        Início
                    </a>

                    <a href="#packs">
                        Packs
                    </a>

                    <a href="#vinhos">
                        Vinhos
                    </a>

                    <a href="#entrega">
                        Entrega
                    </a>

                    <a href="#contactos">
                        Contactos
                    </a>

                </nav>

                {/* AÇÕES */}
                <div className="header-actions">

                    {/* CARRINHO */}
                    <button
                        className="cart-button"
                        onClick={() => setCartOpen(true)}
                        aria-label="Abrir carrinho"
                    >
                        🛒

                        {totalItems > 0 && (
                            <span className="cart-count">
                                {totalItems}
                            </span>
                        )}

                    </button>

                    {/* LOGIN / DASHBOARD */}
                    <Link
                        to="/admin/login"
                        className="admin-btn"
                    >
                        Dashboard
                    </Link>

                    {/* WHATSAPP */}
                    <a
                        href="https://wa.me/351XXXXXXXXX?text=Olá,%20quero%20fazer%20uma%20encomenda%20na%20A%20Menina%20da%20Horta."
                        className="whatsapp-btn"
                        target="_blank"
                        rel="noreferrer"
                    >
                        WhatsApp
                    </a>

                </div>

            </div>

        </header>

    )
}

export default Header
