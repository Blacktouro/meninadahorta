import { useState } from 'react'
import '../styles/contactos.css'

function Contactos() {
    const [nome, setNome] = useState('')
    const [mensagem, setMensagem] = useState('')

    const numeroWhatsApp = '351938048031'

    const enviarWhatsApp = (e) => {
        e.preventDefault()

        const texto = `Olá, sou ${nome || 'cliente'}.

Mensagem:
${mensagem || 'Queria pedir mais informações sobre produtos, packs e entregas.'}

Obrigado.`

        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`
        window.open(url, '_blank')
    }

    return (
        <section id="contactos" className="contactos-section">
            <div className="container contactos-container">

                <div className="contactos-info">
                    <span className="contactos-label">
                        Fala connosco
                    </span>

                    <h2>
                        Tens dúvidas ou queres fazer um pedido especial?
                    </h2>

                    <p>
                        Envia uma mensagem pelo WhatsApp e diz-nos o que precisas.
                        Podemos preparar packs personalizados para churrascos,
                        festas, futebol, convívios e entregas de última hora.
                    </p>

                    <div className="contactos-cards">

                        <div className="contacto-card">
                            <strong>🚚 Entregas</strong>
                            <span>Peniche e arredores</span>
                        </div>

                        <div className="contacto-card">
                            <strong>💬 WhatsApp</strong>
                            <span>Resposta rápida</span>
                        </div>

                        <div className="contacto-card">
                            <strong>🔥 Packs</strong>
                            <span>Churrasco, vinho, cerveja e carvão</span>
                        </div>

                    </div>
                </div>

                <form className="contactos-form" onSubmit={enviarWhatsApp}>

                    <h3>Enviar mensagem</h3>

                    <div className="form-group">
                        <label>O teu nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Ex: André"
                        />
                    </div>

                    <div className="form-group">
                        <label>Mensagem</label>
                        <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            placeholder="Ex: Quero saber se entregam hoje em Peniche..."
                        />
                    </div>

                    <button type="submit" className="contactos-btn">
                        Enviar pelo WhatsApp
                    </button>

                    <small>
                        Ao clicar, abrimos o WhatsApp com a mensagem pronta.
                    </small>

                </form>

            </div>
        </section>
    )
}

export default Contactos
