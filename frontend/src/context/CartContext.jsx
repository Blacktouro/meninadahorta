import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([])
    const [cartOpen, setCartOpen] = useState(false)

    const addToCart = (product) => {
        setCartItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.nome === product.nome)

            if (existingItem) {
                return currentItems.map((item) =>
                    item.nome === product.nome
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                )
            }

            return [
                ...currentItems,
                {
                    ...product,
                    quantidade: 1
                }
            ]
        })

        setCartOpen(true)
    }

    const removeFromCart = (nome) => {
        setCartItems((currentItems) =>
            currentItems.filter((item) => item.nome !== nome)
        )
    }

    const increaseQuantity = (nome) => {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.nome === nome
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item
            )
        )
    }

    const decreaseQuantity = (nome) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) =>
                    item.nome === nome
                        ? { ...item, quantidade: item.quantidade - 1 }
                        : item
                )
                .filter((item) => item.quantidade > 0)
        )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const totalItems = cartItems.reduce((total, item) => total + item.quantidade, 0)

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.preco * item.quantidade,
        0
    )

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartOpen,
                setCartOpen,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                totalItems,
                totalPrice
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}
