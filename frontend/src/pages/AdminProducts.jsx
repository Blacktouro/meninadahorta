import { useState } from "react";

function AdminProducts() {

    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        preco: "",
        categoria_id: "",
        imagem: "",
        stock: "",
        destaque: false
    });

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const criarProduto = async (e) => {

        e.preventDefault();

        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        alert(data.message);
    };

    return (
        <div>

            <h1>Painel Admin</h1>

            <form onSubmit={criarProduto}>

                <input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    onChange={handleChange}
                />

                <textarea
                    name="descricao"
                    placeholder="Descrição"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    step="0.01"
                    name="preco"
                    placeholder="Preço"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="categoria_id"
                    placeholder="Categoria ID"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="imagem"
                    placeholder="Imagem"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    onChange={handleChange}
                />

                <label>
                    Destaque
                    <input
                        type="checkbox"
                        name="destaque"
                        onChange={handleChange}
                    />
                </label>

                <button type="submit">
                    Criar Produto
                </button>

            </form>

        </div>
    );
}

export default AdminProducts;
