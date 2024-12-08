import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ProductListSeller.scss";
import { useNavigate } from "react-router-dom";

const ProductListSeller = ({ token }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get("http://localhost:9000/productos/vendedor", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProductos(response.data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, [token]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "¿Estás seguro de que deseas eliminar este producto?"
        );
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:9000/producto/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const updatedProductos = productos.filter((producto) => producto.id !== id);
                setProductos(updatedProductos);
                alert("Producto eliminado correctamente.");
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                alert("Error al eliminar el producto.");
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/productos/editar/${id}`);
    };

    const handleAdd = () => {
        navigate("/productos/nuevo");
    };

    if (loading) return <p>Cargando productos...</p>;

    return (
        <div className="product-panel">
            <h1>Mis Productos</h1>
            <button onClick={handleAdd}>Añadir Nuevo Producto</button>
            {productos.length === 0 ? (
                <p className="no-products">No tienes productos en venta.</p>
            ) : (
                <ul>
                    {productos.map((producto) => (
                        <li
                            key={producto.id}
                            onClick={() => navigate(`/product/${producto.id}`)}
                        >
                            <img src={`${producto.imagenes[0]?.url}`} 
                            alt={producto.nombre} className="product-image" 
                            style={{ width: "auto", height: "150px", marginBottom: "10px" }}
                            />
                            <div>
                                <p>{producto.nombre}</p>
                                <p>Categoría: {producto.categoria.nombre}</p>
                                <p>{producto.descripcion}</p>
                                <p className="product-price">Precio: {producto.precio}€</p>
                            </div>
                            <div className="product-buttons">
                                <button
                                    className="edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(producto.id);
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    className="delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(producto.id);
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductListSeller;
