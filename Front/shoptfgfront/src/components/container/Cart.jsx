import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../styles/Cart.scss";

const Cart = ({ userId, token }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const isInitialRender = useRef(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrCreateCart = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/carrito/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data && response.data.productos) {
                    const productos = response.data.productos || [];
                    setCartItems(productos);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    try {
                        await axios.post(`http://localhost:9000/carrito/create/${userId}`, {}, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setCartItems([]);
                    } catch (createError) {
                        console.error('Error al crear el carrito:', createError);
                    }
                } else {
                    console.error('Error desconocido al obtener el carrito:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        if (isInitialRender.current && userId) {
            fetchOrCreateCart();
            isInitialRender.current = false;
        }
    }, [userId, token]);

    const handleDecrease = async (productoId) => {
        const producto = cartItems.find(item => item.id === productoId);
        const currentQuantity = producto?.pivot?.cantidad || 1;
    
        if (currentQuantity > 1) {
            try {
                const response = await axios.put(
                    `http://localhost:9000/carrito/update/${userId}/${productoId}`,
                    { cantidad: currentQuantity - 1 },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                if (response.data.success) {
                    setCartItems(prevItems =>
                        prevItems.map(item =>
                            item.id === productoId
                                ? { ...item, pivot: { ...item.pivot, cantidad: currentQuantity - 1 } }
                                : item
                        )
                    );
                }
            } catch (error) {
                console.error('Error al disminuir la cantidad del producto:', error);
            }
        }
    };
    
    const handleIncrease = async (productoId) => {
        const producto = cartItems.find(item => item.id === productoId);
        const currentQuantity = producto?.pivot?.cantidad || 1;
    
        try {
            const response = await axios.put(
                `http://localhost:9000/carrito/update/${userId}/${productoId}`,
                { cantidad: currentQuantity + 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.data.success) {
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.id === productoId
                            ? { ...item, pivot: { ...item.pivot, cantidad: currentQuantity + 1 } }
                            : item
                    )
                );
            }
        } catch (error) {
            console.error('Error al aumentar la cantidad del producto:', error);
        }
    };
    

    const handleRemoveItem = async (productoId) => {
        try {
            const response = await axios.delete(`http://localhost:9000/carrito/remove/${userId}/${productoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setCartItems(cartItems.filter(producto => producto.id !== productoId));
            } else {
                console.error('Error al eliminar el producto del carrito:', response.data.message);
            }
        } catch (error) {
            console.error('Error removing producto from cart:', error);
        }
    };

    const handleClearCart = async () => {
        try {
            const response = await axios.delete(`http://localhost:9000/carrito/clear/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setCartItems([]);
            } else {
                console.error('Error clearing cart:', response.data.message);
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, producto) => {
            const precio = parseFloat(producto.precio);
            const cantidad = producto.pivot ? producto.pivot.cantidad : 1;
            return total + (precio * cantidad);
        }, 0);
    };

    const handleGoToPayment = () => {
        const total = calculateTotal();
        navigate('/payment', { state: { total, userId } });
    };

    if (loading) return <p>Loading cart products...</p>;

    return (
        <div className="cart-container">
            <div className="products-box">
                {cartItems.length === 0 ? (
                    <div className="empty-cart-message">
                        <p>No hay productos en el carrito</p>
                    </div>
                ) : (
                    cartItems.map(producto => (
                        <div className="product-item" key={producto.id}>
                            <div className="product-info">
                                <img src={`${producto.imagenes[0]?.url}`} alt={producto.nombre} />
                                <div className="product-details">
                                    <p className="product-name">{producto.nombre}</p>
                                    <p className="product-price">{producto.precio}€</p>
                                </div>
                            </div>
                            <div className="quantity-controls">
                                <button onClick={() => handleDecrease(producto.id)}>-</button>
                                <p>{producto.pivot?.cantidad || 1}</p>
                                <button onClick={() => handleIncrease(producto.id)}>+</button>
                            </div>
                            <p className="product-total">
                                {(producto.pivot?.cantidad || 1) * parseFloat(producto.precio)}€
                            </p>
                        </div>
                    ))
                )}
            </div>
            {cartItems.length > 0 && (
                <div className="summary-box">
                    <h3>Resumen</h3>
                    {cartItems.map(producto => (
                        <div className="summary-item" key={producto.id}>
                            <span>{producto.nombre} x{producto.pivot?.cantidad || 1}</span>
                            <span>{(producto.pivot?.cantidad || 1) * parseFloat(producto.precio)}€</span>
                        </div>
                    ))}
                    <div className="summary-item total">
                        <span>Total:</span>
                        <span>{calculateTotal()}€</span>
                    </div>
                    <button onClick={handleClearCart}>Borrar Carrito</button>
                    <button onClick={handleGoToPayment}>Ir al Pago</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
