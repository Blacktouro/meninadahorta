import { useEffect, useState } from "react";

import AdminSidebar from "../components/admin/AdminSidebar";
import ProductForm from "../components/admin/ProductForm";
import ProductCard from "../components/admin/ProductCard";

import "../styles/admin/admin.css";

function AdminProducts() {

    const [products, setProducts] = useState([]);

    const carregarProdutos = async () => {

        try {

            const response = await fetch("/api/products");
            const data = await response.json();

            setProducts(data);

        } catch (err) {

            console.error(err);
        }
    };

    useEffect(() => {

        carregarProdutos();

    }, []);

    const apagarProduto = async (id) => {

        if (!window.confirm("Apagar produto?")) return;

        try {

            await fetch(`/api/products/${id}`, {
                method: "DELETE"
            });

            carregarProdutos();

        } catch (err) {

            console.error(err);
        }
    };

    return (

        <div className="admin-layout">

            <AdminSidebar />

            <div className="admin-content">

                <div className="admin-top">

                    <div>
                        <h1>Painel Admin</h1>
                        <p>Gerir produtos da loja</p>
                    </div>

                    <button className="logout-btn">
                        Logout
                    </button>

                </div>

                <ProductForm onSuccess={carregarProdutos} />

                <div className="admin-section">

                    <h2>Produtos</h2>

                    <div className="products-grid">

                        {products.map((product) => (

                            <ProductCard
                                key={product.id}
                                product={product}
                                onDelete={apagarProduto}
                            />

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminProducts;