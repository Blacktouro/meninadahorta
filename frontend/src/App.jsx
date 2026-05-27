import {
    HashRouter,
    Routes,
    Route
} from 'react-router-dom'


import AdminDashboard from './pages/AdminDashboard'
import Header from './components/layout/Header'
import Hero from './components/Hero'
import Packs from './components/Packs'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import CartModal from './components/CartModal'
import Vinhos from './components/Vinhos'
import Contactos from './components/Contactos'
import PrivateRoute from './components/PrivateRoute'
import { CartProvider } from './context/CartContext'
import AdminProducts from './pages/AdminProducts'
import AdminLogin from './pages/AdminLogin'

function HomePage() {
    return (
        <>
            <Header />
            <Hero />
            <Packs />
            <Vinhos />
            <Contactos />
            <Footer />
            <WhatsAppButton />
            <CartModal />
        </>
    )
}

function App() {

    return (

        <HashRouter>

            <CartProvider>

                <Routes>

                    {/* HOME */}
                    <Route
                        path="/"
                        element={<HomePage />}
                    />

                    {/* LOGIN ADMIN */}
                    <Route
                        path="/admin/login"
                        element={<AdminLogin />}
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                           <PrivateRoute>
                           <AdminDashboard />
                           </PrivateRoute>
                         }
                    />
               <Route path="/admin/products" element={<AdminProducts />} />
                          

                </Routes>

            </CartProvider>

        </HashRouter>

    )
}

export default App
