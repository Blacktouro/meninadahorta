import { useState } from 'react'
import { useCart } from '../context/CartContext'
import DeliveryMap from './DeliveryMap'
import '../styles/cart.css'

function CartModal() {
    const {
        cartItems,
        cartOpen,
        setCartOpen,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalPrice
    } = useCart()

    const [nome, setNome] = useState('')
    const [telefone, setTelefone] = useState('')
    const [pagamento, setPagamento] = useState('mbway')

    const [rua, setRua] = useState('')
    const [numeroPorta, setNumeroPorta] = useState('')
    const [codigoPostal, setCodigoPostal] = useState('')
    const [localidade, setLocalidade] = useState('Peniche')
    const [referencia, setReferencia] = useState('')

    const [entregaInfo, setEntregaInfo] = useState(null)
    const [aCalcularEntrega, setACalcularEntrega] = useState(false)
    const [erroEntrega, setErroEntrega] = useState('')
    const [pontoEscolhido, setPontoEscolhido] = useState(false)
    const [usouLocalizacaoAtual, setUsouLocalizacaoAtual] = useState(false)
    const [confirmacaoAberta, setConfirmacaoAberta] = useState(false)

    const numeroWhatsApp = '351XXXXXXXXX'

    if (!cartOpen) return null

    const textoPagamento = {
        mbway: 'MB WAY',
        dinheiro: 'Dinheiro na entrega',
        transferencia: 'Transferência bancária'
    }

    const formatarEuros = (valor) => Number(valor || 0).toFixed(2)

    const moradaCompleta = `${rua} ${numeroPorta}, ${codigoPostal} ${localidade}, Portugal`
        .replace(/\s+/g, ' ')
        .trim()

    const entregaFoiCalculada =
        entregaInfo &&
        entregaInfo.delivery_fee !== null &&
        entregaInfo.delivery_fee !== undefined

    const entregaSobConsulta =
        entregaInfo &&
        entregaInfo.delivery_fee === null

    const entregaValor = entregaFoiCalculada
        ? Number(entregaInfo.delivery_fee)
        : 0

    const totalFinal = totalPrice + entregaValor

    const limparEntrega = () => {
        setEntregaInfo(null)
        setErroEntrega('')
        setPontoEscolhido(false)
        setUsouLocalizacaoAtual(false)
        setConfirmacaoAberta(false)
    }

    const validarMorada = () => {
        if (!rua.trim()) return 'Preenche a rua.'
        if (!numeroPorta.trim()) return 'Preenche o número da porta.'
        if (!codigoPostal.trim()) return 'Preenche o código postal.'
        if (!localidade.trim()) return 'Preenche a localidade.'
        return ''
    }

    const calcularEntrega = async ({ lat = null, lng = null, origem = 'morada' } = {}) => {
        if (cartItems.length === 0) {
            setErroEntrega('Adiciona produtos ao carrinho antes de calcular a entrega.')
            setEntregaInfo(null)
            return
        }

        const temCoordenadas = lat !== null && lng !== null

        if (!temCoordenadas) {
            const erroMorada = validarMorada()

            if (erroMorada) {
                setErroEntrega(erroMorada)
                setEntregaInfo(null)
                return
            }
        }

        try {
            setACalcularEntrega(true)
            setErroEntrega('')
            setConfirmacaoAberta(false)

            const payload = {
                morada: temCoordenadas ? 'Ponto escolhido no mapa/localização atual' : moradaCompleta,
                subtotal: totalPrice
            }

            if (temCoordenadas) {
                payload.destination_lat = lat
                payload.destination_lng = lng
            }

            const response = await fetch('/api/calcular-entrega', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                setErroEntrega(data.error || 'Não foi possível calcular a entrega.')
                setEntregaInfo(null)
                return
            }

            setEntregaInfo(data)
            setPontoEscolhido(origem === 'mapa' || origem === 'gps')
            setUsouLocalizacaoAtual(origem === 'gps')
        } catch (error) {
            setErroEntrega('Erro ao calcular a entrega. Verifica a ligação e tenta novamente.')
            setEntregaInfo(null)
        } finally {
            setACalcularEntrega(false)
        }
    }

    const calcularEntregaAutomatica = () => {
        calcularEntrega({ origem: 'morada' })
    }

    const recalcularComPontoMapa = async (lat, lng) => {
        await calcularEntrega({
            lat,
            lng,
            origem: 'mapa'
        })
    }

    const usarLocalizacaoAtual = () => {
        if (!navigator.geolocation) {
            setErroEntrega('O teu dispositivo não suporta geolocalização.')
            return
        }

        if (cartItems.length === 0) {
            setErroEntrega('Adiciona produtos ao carrinho antes de usar a localização.')
            return
        }

        setACalcularEntrega(true)
        setErroEntrega('')
        setConfirmacaoAberta(false)

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude
                const lng = position.coords.longitude

                await calcularEntrega({
                    lat,
                    lng,
                    origem: 'gps'
                })
            },
            () => {
                setErroEntrega('Não foi possível obter a localização. Confirma se deste permissão ao browser.')
                setACalcularEntrega(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 12000,
                maximumAge: 0
            }
        )
    }

    const getEntregaTexto = () => {
        if (!entregaInfo) return 'Ainda não calculada'
        if (entregaSobConsulta) return 'Sob consulta'
        if (Number(entregaInfo.delivery_fee) === 0) return 'Grátis'
        return `${formatarEuros(entregaInfo.delivery_fee)}€`
    }

    const getTotalTexto = () => {
        if (!entregaInfo) return `${formatarEuros(totalPrice)}€ + entrega por confirmar`
        if (entregaSobConsulta) return `${formatarEuros(totalPrice)}€ + entrega sob consulta`
        return `${formatarEuros(totalFinal)}€`
    }

    const criarMensagemWhatsApp = () => {
        const produtosTexto = cartItems
            .map((item) => {
                const subtotal = item.preco * item.quantidade
                return `- ${item.nome} x${item.quantidade} — ${formatarEuros(subtotal)}€`
            })
            .join('\n')

        const coordenadasTexto =
            entregaInfo?.destination_lat && entregaInfo?.destination_lng
                ? `\nPonto no mapa:\nhttps://www.google.com/maps?q=${entregaInfo.destination_lat},${entregaInfo.destination_lng}`
                : ''

        const referenciaTexto = referencia
            ? `\nReferência:\n${referencia}`
            : ''

        const mensagem = `Olá, quero fazer uma encomenda na A Menina da Horta.

Nome:
${nome || 'Não indicado'}

Telefone:
${telefone || 'Não indicado'}

Produtos:
${produtosTexto}

Subtotal:
${formatarEuros(totalPrice)}€

Morada de entrega:
${moradaCompleta || 'Ainda não indicada'}
${referenciaTexto}

Morada localizada:
${entregaInfo?.destination_label || 'Ainda não calculada'}

Localização usada:
${usouLocalizacaoAtual ? 'GPS do telemóvel' : pontoEscolhido ? 'Ponto ajustado no mapa' : 'Morada escrita'}

Distância:
${entregaInfo ? `${entregaInfo.distance_km} km` : 'Ainda não calculada'}

Tempo estimado:
${entregaInfo ? `${entregaInfo.duration_min} min` : 'Ainda não calculado'}

Entrega:
${getEntregaTexto()}

Total:
${getTotalTexto()}

Pagamento:
${textoPagamento[pagamento]}
${coordenadasTexto}

Obrigado.`

        return `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`
    }

    const abrirConfirmacao = () => {
        if (cartItems.length === 0) {
            setErroEntrega('Adiciona produtos ao carrinho antes de encomendar.')
            return
        }

        if (!entregaInfo) {
            setErroEntrega('Calcula a entrega antes de enviar a encomenda.')
            return
        }

        setErroEntrega('')
        setConfirmacaoAberta(true)
    }

    const limparCarrinhoCompleto = () => {
        clearCart()
        setNome('')
        setTelefone('')
        setRua('')
        setNumeroPorta('')
        setCodigoPostal('')
        setLocalidade('Peniche')
        setReferencia('')
        setEntregaInfo(null)
        setErroEntrega('')
        setPontoEscolhido(false)
        setUsouLocalizacaoAtual(false)
        setConfirmacaoAberta(false)
    }

    return (
        <div className="cart-backdrop">
            <div className="cart-modal">

                <button
                    className="cart-close"
                    onClick={() => setCartOpen(false)}
                    aria-label="Fechar carrinho"
                >
                    ×
                </button>

                <div className="cart-header">
                    <span>🛒</span>

                    <div>
                        <h2>O teu carrinho</h2>
                        <p>Confirma os produtos, indica a morada e calcula a entrega.</p>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <p className="cart-empty">
                        Ainda não adicionaste produtos.
                    </p>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div className="cart-item" key={item.nome}>

                                    <div className="cart-item-main">
                                        <div>
                                            <h4>{item.nome}</h4>
                                            <span>{formatarEuros(item.preco)}€ / unidade</span>
                                        </div>

                                        <strong>
                                            {formatarEuros(item.preco * item.quantidade)}€
                                        </strong>
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="cart-controls">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    decreaseQuantity(item.nome)
                                                    limparEntrega()
                                                }}
                                            >
                                                -
                                            </button>

                                            <strong>{item.quantidade}</strong>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    increaseQuantity(item.nome)
                                                    limparEntrega()
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            className="cart-remove"
                                            onClick={() => {
                                                removeFromCart(item.nome)
                                                limparEntrega()
                                            }}
                                        >
                                            Remover
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>

                        <div className="cart-form-grid">

                            <div className="cart-field">
                                <label>Nome</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="O teu nome"
                                />
                            </div>

                            <div className="cart-field">
                                <label>Telefone</label>
                                <input
                                    type="tel"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    placeholder="Ex: 912 345 678"
                                />
                            </div>

                            <div className="cart-field cart-field-full">
                                <label>Rua</label>
                                <input
                                    type="text"
                                    value={rua}
                                    onChange={(e) => {
                                        setRua(e.target.value)
                                        limparEntrega()
                                    }}
                                    placeholder="Ex: Rua Alexandre Herculano"
                                />
                            </div>

                            <div className="cart-field">
                                <label>Número / andar</label>
                                <input
                                    type="text"
                                    value={numeroPorta}
                                    onChange={(e) => {
                                        setNumeroPorta(e.target.value)
                                        limparEntrega()
                                    }}
                                    placeholder="Ex: 12, 2º Esq."
                                />
                            </div>

                            <div className="cart-field">
                                <label>Código postal</label>
                                <input
                                    type="text"
                                    value={codigoPostal}
                                    onChange={(e) => {
                                        setCodigoPostal(e.target.value)
                                        limparEntrega()
                                    }}
                                    placeholder="Ex: 2520-000"
                                />
                            </div>

                            <div className="cart-field">
                                <label>Localidade</label>
                                <input
                                    type="text"
                                    value={localidade}
                                    onChange={(e) => {
                                        setLocalidade(e.target.value)
                                        limparEntrega()
                                    }}
                                    placeholder="Ex: Peniche"
                                />
                            </div>

                            <div className="cart-field">
                                <label>Forma de pagamento</label>
                                <select
                                    value={pagamento}
                                    onChange={(e) => setPagamento(e.target.value)}
                                >
                                    <option value="mbway">MB WAY</option>
                                    <option value="dinheiro">Dinheiro na entrega</option>
                                    <option value="transferencia">Transferência bancária</option>
                                </select>
                            </div>

                            <div className="cart-field cart-field-full">
                                <label>Referência para entrega</label>
                                <textarea
                                    value={referencia}
                                    onChange={(e) => setReferencia(e.target.value)}
                                    placeholder="Ex: Portão verde, tocar no 2º esquerdo, entregar nas traseiras..."
                                />
                            </div>

                        </div>

                        <button
                            type="button"
                            className="cart-calculate-btn"
                            onClick={calcularEntregaAutomatica}
                            disabled={aCalcularEntrega}
                        >
                            {aCalcularEntrega
                                ? 'A calcular entrega...'
                                : 'Calcular entrega pela morada'}
                        </button>

                        <button
                            type="button"
                            className="cart-location-btn"
                            onClick={usarLocalizacaoAtual}
                            disabled={aCalcularEntrega}
                        >
                            📍 Usar a minha localização atual
                        </button>

                        {erroEntrega && (
                            <div className="cart-error">
                                {erroEntrega}
                            </div>
                        )}

                        {entregaInfo && (
                            <>
                                <div className="delivery-result">
                                    <div>
                                        <span>📍 Distância</span>
                                        <strong>{entregaInfo.distance_km} km</strong>
                                    </div>

                                    <div>
                                        <span>⏱️ Tempo estimado</span>
                                        <strong>{entregaInfo.duration_min} min</strong>
                                    </div>

                                    <div>
                                        <span>🚚 Entrega</span>
                                        <strong>{getEntregaTexto()}</strong>
                                    </div>

                                    {entregaInfo.destination_label && (
                                        <p>
                                            Morada localizada: {entregaInfo.destination_label}
                                        </p>
                                    )}

                                    {usouLocalizacaoAtual && (
                                        <p>
                                            Localização obtida pelo GPS do telemóvel.
                                        </p>
                                    )}

                                    {pontoEscolhido && !usouLocalizacaoAtual && (
                                        <p>
                                            Ponto ajustado manualmente no mapa.
                                        </p>
                                    )}
                                </div>

                                <DeliveryMap
                                    entregaInfo={entregaInfo}
                                    onSelectPoint={recalcularComPontoMapa}
                                />
                            </>
                        )}

                        {entregaInfo &&
                            Number(entregaInfo.delivery_fee) === 0 &&
                            totalPrice >= 50 && (
                                <div className="cart-free-delivery">
                                    🎉 Entrega grátis aplicada nesta encomenda
                                </div>
                            )}

                        {entregaSobConsulta && (
                            <div className="cart-warning">
                                Esta entrega está fora da zona normal. O valor será confirmado por WhatsApp.
                            </div>
                        )}

                        <div className="cart-summary">
                            <div>
                                <span>Subtotal</span>
                                <strong>{formatarEuros(totalPrice)}€</strong>
                            </div>

                            <div>
                                <span>Entrega</span>
                                <strong>
                                    {!entregaInfo ? 'Por calcular' : getEntregaTexto()}
                                </strong>
                            </div>

                            <div className="cart-summary-total">
                                <span>Total final</span>
                                <strong>{getTotalTexto()}</strong>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="cart-whatsapp-btn"
                            onClick={abrirConfirmacao}
                        >
                            Encomendar pelo WhatsApp
                        </button>

                        <button
                            type="button"
                            className="cart-clear"
                            onClick={limparCarrinhoCompleto}
                        >
                            Limpar carrinho
                        </button>
                    </>
                )}

                {confirmacaoAberta && (
                    <div className="confirm-backdrop">
                        <div className="confirm-modal">

                            <h3>Confirmar encomenda?</h3>

                            <p>
                                Confirma se os produtos, a morada, o ponto no mapa e o valor estão corretos.
                            </p>

                            <div className="confirm-products">
                                {cartItems.map((item) => (
                                    <div key={item.nome}>
                                        <span>{item.nome} x{item.quantidade}</span>
                                        <strong>{formatarEuros(item.preco * item.quantidade)}€</strong>
                                    </div>
                                ))}
                            </div>

                            <div className="confirm-summary">
                                <div>
                                    <span>Subtotal</span>
                                    <strong>{formatarEuros(totalPrice)}€</strong>
                                </div>

                                <div>
                                    <span>Entrega</span>
                                    <strong>{getEntregaTexto()}</strong>
                                </div>

                                <div>
                                    <span>Total</span>
                                    <strong>{getTotalTexto()}</strong>
                                </div>
                            </div>

                            <div className="confirm-address">
                                <strong>Entrega:</strong>
                                <span>{moradaCompleta}</span>
                            </div>

                            <div className="confirm-actions">
                                <button
                                    type="button"
                                    className="confirm-cancel"
                                    onClick={() => setConfirmacaoAberta(false)}
                                >
                                    Voltar e corrigir
                                </button>

                                <a
                                    href={criarMensagemWhatsApp()}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="confirm-send"
                                >
                                    Confirmar e abrir WhatsApp
                                </a>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default CartModal
