import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {

    const token = localStorage.getItem('token')

    if (!token) {
        return <Navigate to="/admin/login" />
    }

    return children
}

export default PrivateRoute
