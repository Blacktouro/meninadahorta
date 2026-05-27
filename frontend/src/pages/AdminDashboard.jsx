import '../styles/admin-dashboard.css'

import {
    useNavigate,
    Link
} from 'react-router-dom'

function AdminDashboard() {

    const navigate = useNavigate()

    const handleLogout = () => {

        localStorage.removeItem('token')
        localStorage.removeItem('admin_email')

        navigate('/admin/login')
    }

    return (

        <div className="admin-layout">

            {/* SIDEBAR */}
            <aside className="admin-sidebar">

                <div className="sidebar-logo">
                    🌿 Menina da Horta
                </div>

                <nav className="sidebar-menu">

                    <Link to="/admin/dashboard">
                        📊 Dashboard
                    </Link>

                    <Link to="/admin/products">
                        📦 Produtos
                    </Link>

                    <Link to="/admin/orders">
                        🛒 Encomendas
                    </Link>

                    <Link to="/admin/customers">
                        👥 Clientes
                    </Link>

                    <Link to="/admin/deliveries">
                        🚚 Entregas
                    </Link>

                    <Link to="/admin/finance">
                        💰 Financeiro
                    </Link>

                    <Link to="/admin/settings">
                        ⚙️ Definições
                    </Link>

                </nav>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    🚪 Logout
                </button>

            </aside>

            {/* MAIN CONTENT */}
            <main className="admin-content">

                {/* HEADER */}
                <div className="dashboard-header">

                    <div>

                        <h1>
                            Dashboard Administrativo
                        </h1>

                        <p>
                            Bem-vindo ao painel da Menina da Horta 🌿
                        </p>

                    </div>

                    <div className="admin-user">

                        <span>
                            👤 Admin
                        </span>

                    </div>

                </div>

                {/* KPI CARDS */}
                <div className="dashboard-cards">

                    <div className="dashboard-card">

                        <div className="card-icon">
                            📦
                        </div>

                        <div>

                            <h3>
                                Produtos
                            </h3>

                            <span>
                                24
                            </span>

                        </div>

                    </div>

                    <div className="dashboard-card">

                        <div className="card-icon">
                            🛒
                        </div>

                        <div>

                            <h3>
                                Encomendas Hoje
                            </h3>

                            <span>
                                12
                            </span>

                        </div>

                    </div>

                    <div className="dashboard-card">

                        <div className="card-icon">
                            💰
                        </div>

                        <div>

                            <h3>
                                Vendas Hoje
                            </h3>

                            <span>
                                245€
                            </span>

                        </div>

                    </div>

                    <div className="dashboard-card">

                        <div className="card-icon">
                            👥
                        </div>

                        <div>

                            <h3>
                                Clientes
                            </h3>

                            <span>
                                19
                            </span>

                        </div>

                    </div>

                </div>

                {/* QUICK ACTIONS */}
                <div className="dashboard-section">

                    <h2>
                        ⚡ Ações rápidas
                    </h2>

                    <div className="quick-actions">

                        <button
                            onClick={() => navigate('/admin/products')}
                        >
                            ➕ Adicionar Produto
                        </button>

                        <button>
                            📦 Ver Encomendas
                        </button>

                        <button>
                            🚚 Gerir Entregas
                        </button>

                        <button>
                            📊 Ver Relatórios
                        </button>

                    </div>

                </div>

                {/* RECENT ORDERS */}
                <div className="dashboard-section">

                    <h2>
                        🛒 Últimas Encomendas
                    </h2>

                    <div className="orders-table">

                        <div className="table-header">

                            <span>
                                Cliente
                            </span>

                            <span>
                                Valor
                            </span>

                            <span>
                                Estado
                            </span>

                        </div>

                        <div className="table-row">

                            <span>
                                João Silva
                            </span>

                            <span>
                                39€
                            </span>

                            <span className="status entregue">
                                Entregue
                            </span>

                        </div>

                        <div className="table-row">

                            <span>
                                Maria Costa
                            </span>

                            <span>
                                22€
                            </span>

                            <span className="status pendente">
                                Pendente
                            </span>

                        </div>

                        <div className="table-row">

                            <span>
                                André Santos
                            </span>

                            <span>
                                58€
                            </span>

                            <span className="status entrega">
                                Em entrega
                            </span>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    )
}

export default AdminDashboard
