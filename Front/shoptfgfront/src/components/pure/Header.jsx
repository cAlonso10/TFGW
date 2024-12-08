import "../../styles/Header.scss";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FaShoppingCart } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = ({ onSearch, handleLogout, token, userId }) => {
    const [cartCount, setCartCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isVendedor, setIsVendedor] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const rutasSinBarra = [
        "/cart",
        "/adminPanel",
        "/payment",
        "/productos/vendedor",
        "/editar-producto"
    ];
    const quitarBarra = rutasSinBarra.some((ruta) => location.pathname.startsWith(ruta));

    useEffect(() => {
        const fetchTipoUsuario = async () => {
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setIsAdmin(decodedToken.tipo === "administrador");
                    setIsVendedor(decodedToken.tipo === "vendedor");
                } catch (error) {
                    console.error("Error decoding token:", error);
                }
            }
        }

        const fetchCartCount = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:9000/carrito/count/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setCartCount(response.data.count || 0);
            } catch (error) {
                console.error("Error al obtener la cantidad de productos en el carrito:", error);
            }
        };
        
        fetchCartCount();
        fetchTipoUsuario();
    }, [token, userId]);

    return (
        <header className="header">
            <div className="logo">
                <a href="/">
                    <span>ShopProvider</span>
                </a>
            </div>
            {!quitarBarra && (
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            )}
            <div className="header-actions">
                {token && (
                    <>
                        <a href="/cart" className="cart-icon">
                            <FaShoppingCart size={28} />
                            {cartCount > 0 && (
                                <span className="cart-count">{cartCount}</span>
                            )}
                        </a>
                        {isAdmin && (
                            <button
                                className="admin-button"
                                onClick={() => navigate("/adminPanel")}
                            >
                                Administrar
                            </button>
                        )}
                        {isVendedor && (
                            <button
                                className="vendedor-button"
                                onClick={() => navigate(`/productos/vendedor`)}
                            >
                                Productos
                            </button>
                        )}
                        <button onClick={handleLogout} className="logout-button">
                            Cerrar sesión
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
