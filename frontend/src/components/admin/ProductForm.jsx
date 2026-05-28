import { useState } from "react";

import "../../styles/admin/form.css";

function ProductForm({ onSuccess }) {

    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        preco: "",
        categoria_id: "",
        stock: "",
        destaque: false
    });

    const [imagem, setImagem] = useState(null);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox"
                ? checked
                : value
        });
    };

    const criarProduto = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        Object.keys(form).forEach((key) => {
            formData.append(key, form[key]);
        });

        formData.append("imagem", imagem);

        try {

            const response = await fetch("/api/products", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            alert(data.message);

            onSuccess();

        } catch (err) {

            console.error(err);
        }
    };

    return (

        <form
            className="product-form"
            onSubmit={criarProduto}
        >

            <input
                type="text"
                name="nome"
                placeholder="Nome do produto"
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
                placeholder="Categoria"
                onChange={handleChange}
            />

            <input
                type="number"
                name="stock"
                placeholder="Stock"
                onChange={handleChange}
            />

            <input
                type="file"
                onChange={(e) => setImagem(e.target.files[0])}
            />

            <label className="checkbox">

                <input
                    type="checkbox"
                    name="destaque"
                    onChange={handleChange}
                />

                Produto em destaque

            </label>

            <button type="submit">
                Criar Produto
            </button>

        </form>
    );
}

export default ProductForm;