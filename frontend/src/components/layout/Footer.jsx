import '../../styles/footer.css'

function Footer() {
    const numeroWhatsApp = '351938041038'

    return (
        <footer id="contactos" className="footer">
            <div className="container footer-container">

                <div className="footer-brand">
                    <div className="footer-logo">
                        <span>🌿</span>
                        <div>
                            <h3>A Menina</h3>
                            <small>da Horta</small>
                        </div>
                    </div>

                    <p>
                        Vinhos, cervejas, carvão e packs especiais para churrascos,
                        convívios e entregas rápidas em Peniche e arredores.
                    </p>

                    <a
                        href={`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent('Olá, quero fazer uma encomenda na A Menina da Horta.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="footer-whatsapp"
                    >
                        Encomendar pelo WhatsApp
                    </a>
                </div>

                <div className="footer-column">
                    <h4>Contactos</h4>

                    <ul>
                        <li>
                            <strong>Telefone:</strong>
                            <a href="tel:+351XXXXXXXXX">+351 XXX XXX XXX</a>
                        </li>

                        <li>
                            <strong>WhatsApp:</strong>
                            <a
                                href={`https://wa.me/${numeroWhatsApp}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Enviar mensagem
                            </a>
                        </li>

                        <li>
                            <strong>Email:</strong>
                            <a href="mailto:geral@meninadahorta.pt">
                                geral@meninadahorta.pt
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Entregas</h4>

                    <ul>
                        <li>
                            <strong>Zona:</strong>
                            Peniche e arredores
                        </li>

                        <li>
                            <strong>Morada/base:</strong>
                            Peniche, Portugal
                        </li>

                        <li>
                            <strong>Entrega:</strong>
                            Valor calculado conforme distância
                        </li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Horário</h4>

                    <ul>
                        <li>
                            <strong>Segunda a Sexta:</strong>
                            09:00 - 20:00
                        </li>

                        <li>
                            <strong>Sábado:</strong>
                            09:00 - 21:00
                        </li>

                        <li>
                            <strong>Domingo:</strong>
                            Sob consulta
                        </li>
                    </ul>
                </div>

            </div>

            <div className="container footer-bottom">
                <div className="footer-links">
                    <a href="#">Início</a>
                    <a href="#packs">Packs</a>
                    <a href="#vinhos">Vinhos</a>
                    <a href="#contactos">Contactos</a>
                </div>

                <p>
                    © {new Date().getFullYear()} A Menina da Horta. Todos os direitos reservados.
                </p>

                <small>
                    As encomendas são confirmadas por WhatsApp. Os preços e disponibilidade dos produtos podem variar.
                </small>
            </div>
        </footer>
    )
}

export default Footer
