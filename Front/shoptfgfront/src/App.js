import "./App.css";
import ProductList from "./components/pure/ProductList";
import Header from "./components/pure/Header";
import Login from "./components/pure/Login";
import Register from "./components/pure/Register";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import ProductDetails from "./components/pure/ProductDetails";
import Cart from "./components/container/Cart";
import PaymentPage from "./components/pure/PaymentPage";
import AdminPanel from "./components/pure/AdminPanel";
import UserListAdmin from "./components/pure/UserListAdmin";
import EditUserFormAdmin from "./components/pure/EditUserFormAdmin";
import OrderListAdmin from "./components/pure/OrderListAdmin";
import EditOrderFormAdmin from "./components/pure/EditOrderFormAdmin";
import ProductListAdmin from "./components/pure/ProductListAdmin";
import CategoriesListAdmin from "./components/pure/CategoriesListAdmin";
import ProtectedRoute from "./components/pure/ProtectedRoute";
import NotFound from "./components/pure/NotFound";
import ProductListSeller from "./components/pure/ProductListSeller";
import EditProductForm from "./components/pure/EditProductForm";
import AddProduct from "./components/pure/AddProduct";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("tipo");
        localStorage.removeItem("userId");
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const isAuthenticated = !!token;

    const rutasConHeader = [
        /^\/$/,
        /^\/product\/[0-9]+$/,
        /^\/account$/,
        /^\/payment$/,
        /^\/adminPanel$/,
        /^\/adminPanel\/usuarios$/,
        /^\/adminPanel\/usuarios\/editar\/[0-9]+$/,
        /^\/adminPanel\/pedidos$/,
        /^\/adminPanel\/pedidos\/editar\/[0-9]+$/,
        /^\/adminPanel\/productos$/,
        /^\/adminPanel\/productos\/editar\/[0-9]+$/,
        /^\/adminPanel\/categorias$/,
        /^\/productos\/vendedor$/,
        /^\/editar-producto\/[0-9]+$/,
        /^\/cart$/
    ];

    const rutasHeader = !rutasConHeader.some((ruta) => ruta.test(location.pathname));

    return (
        <div className="App">
            {!rutasHeader && (
                <Header
                    onSearch={handleSearch}
                    handleLogout={handleLogout}
                    token={token}
                    userId={userId}
                />
            )}

            <main>
                <Routes>
                    {/** Login */}
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login setToken={setToken} />} />
                    {/** Register */}
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
                    {/** Lista de productos */}
                    <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProductList token={token} searchQuery={searchQuery} /></ProtectedRoute>} />
                    {/** Detalles del producto */}
                    <Route path="/product/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProductDetails token={token} userId={userId} /></ProtectedRoute>} />
                    {/** Carrito */}
                    <Route path="/cart" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Cart token={token} userId={userId} /></ProtectedRoute>} />
                    {/** Página de pago */}
                    <Route path="/payment" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PaymentPage token={token} /></ProtectedRoute>} />
                    {/** Panel de administrador */}
                    <Route path="/adminPanel" element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="administrador" token={token}><AdminPanel token={token} /></ProtectedRoute>} />
                    {/** Panel de administrador: Usuarios */}
                    <Route path="/adminPanel/usuarios" element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="administrador" token={token}><UserListAdmin token={token} /></ProtectedRoute>} />
                    {/** Panel de administrador: Editar usuario */}
                    <Route path="/adminPanel/usuarios/editar/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="administrador" token={token}><EditUserFormAdmin token={token} /></ProtectedRoute>} />
                    {/** Panel de administrador: Pedidos */}
                    <Route path="/adminPanel/pedidos" element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="administrador" token={token}><OrderListAdmin token={token} /></ProtectedRoute>} />
                    {/** Panel de administrador: Editar pedido */}
                    <Route path="/adminPanel/pedidos/editar/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="administrador" token={token}><EditOrderFormAdmin token={token} /></ProtectedRoute>} />
                    {/** Panel de administrador: Productos */}
                    <Route path="/adminPanel/productos" element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="administrador" token={token}><ProductListAdmin token={token} /></ProtectedRoute>} />
                    {/** Panel de administrador: Productos */}
                    <Route path="/adminPanel/productos/editar/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="administrador" token={token}><EditProductForm token={token} /></ProtectedRoute>} />
                    {/** Panel de administrador: Categorías */}
                    <Route path="/adminPanel/categorias" element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="administrador" token={token}><CategoriesListAdmin token={token} /></ProtectedRoute>} />
                    {/** Productos de vendedor */}
                    <Route path="/productos/vendedor" element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="vendedor" token={token}><ProductListSeller token={token} /></ProtectedRoute>} />
                    {/** Editar productos de vendedor */}
                    <Route path="/productos/editar/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="vendedor" token={token}><EditProductForm token={token} /></ProtectedRoute>} />
                    {/** Añadir productos */}
                    <Route path="/productos/nuevo" element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="vendedor" token={token}><AddProduct token={token} userId={userId} /></ProtectedRoute>} />
                    {/** Error 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </div>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;
