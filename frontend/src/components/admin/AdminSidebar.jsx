import "../../styles/admin/sidebar.css";

function AdminSidebar() {

    return (

        <aside className="admin-sidebar">

            <div className="sidebar-logo">
                🌿 Menina da Horta
            </div>

            <nav>

                <a href="#/admin/products">
                    Produtos
                </a>

                <a href="#/admin/orders">
                    Encomendas
                </a>

                <a href="#/admin/categories">
                    Categorias
                </a>

                <a href="#/admin/users">
                    Utilizadores
                </a>

            </nav>

        </aside>
    );
}

export default AdminSidebar;