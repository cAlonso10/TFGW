import "../../styles/ProductDetails.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = ({ token, userId }) => {
    const { id } = useParams();
    const [producto, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); 


    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/producto/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProduct(response.data);
            } catch (error) {
                console.error("Error al obtener detalles del producto:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id, token]);

    const handleAddToCart = async () => {
        try {
            const response = await axios.post(
                `http://localhost:9000/carrito/add`,
                {
                    userId: userId,
                    productoId: id,
                    cantidad: 1
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.status === 200) {
                alert("Producto añadido al carrito");
            }
        } catch (error) {
            console.error("Error al añadir al carrito:", error);
            alert("Hubo un problema al añadir el producto al carrito.");
        }
    };

    const handleNextImage = () => {
        if (producto && producto.imagenes) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex + 1 === producto.imagenes.length ? 0 : prevIndex + 1
            );
        }
    };

    const handlePreviousImage = () => {
        if (producto && producto.imagenes) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex - 1 < 0 ? producto.imagenes.length - 1 : prevIndex - 1
            );
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (!producto) return <p>No se encontró el producto.</p>;

    return (
        <div className="product-details">
            <h1>{producto.nombre}</h1>

            <div className="image-container">
                <button className="arrow left" onClick={handlePreviousImage}>
                    &#9664;
                </button>
                {producto.imagenes && producto.imagenes.length > 0 && (
                    <img
                        src={producto.imagenes[currentImageIndex].url}
                        alt={`Imagen ${currentImageIndex + 1}`}
                        className="product-image"
                    />
                )}

                <button className="arrow right" onClick={handleNextImage}>
                    &#9654;
                </button>
            </div>

            <p>Descripción: {producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>

            <button
                className="add-to-cart-button"
                onClick={handleAddToCart}
            >
                Añadir al Carrito
            </button>
        </div>
    );
};

export default ProductDetails;
