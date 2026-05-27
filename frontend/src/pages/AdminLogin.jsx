import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import '../styles/admin-login.css'

function AdminLogin() {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState('')

    const handleLogin = async (e) => {

        e.preventDefault()

        setError('')
        setLoading(true)

        try {

            const response = await axios.post(
                'https://meninadahorta.duckdns.org/api/login',
                {
                    email,
                    password
                }
            )

            const data = response.data

            localStorage.setItem(
                'token',
                data.token
            )

            localStorage.setItem(
                'admin_email',
                data.email
            )

            navigate('/admin/dashboard')

        } catch (err) {

            setError(
                err.response?.data?.error ||
                'Erro no login.'
            )

        } finally {

            setLoading(false)

        }

    }

    return (

        <div className="admin-login-page">

            <div className="admin-login-overlay"></div>

            <div className="admin-login-box">

                <div className="admin-login-header">

                    <div className="admin-login-icon">
                        🌿
                    </div>

                    <h1>
                        Painel Administrativo
                    </h1>

                    <p>
                        Aceda ao dashboard da Menina da Horta
                    </p>

                </div>

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="admin@meninadahorta.pt"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                    </div>

                    {error && (

                        <div className="login-error">
                            {error}
                        </div>

                    )}

                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={loading}
                    >

                        {loading
                            ? 'A entrar...'
                            : 'Entrar no Dashboard'
                        }

                    </button>

                </form>

                {/* VOLTAR */}
                <button
                    className="back-site-btn"
                    onClick={() => navigate('/')}
                >
                    ← Voltar ao Website
                </button>

            </div>

        </div>

    )
}

export default AdminLogin
