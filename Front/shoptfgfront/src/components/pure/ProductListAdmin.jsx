import React, { useState, useEffect } from "react";
import "../../styles/ProductListAdmin.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductList = ({ token }) => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [filterCategory, setFilterCategory] = useState("todos");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get("http://localhost:9000/productos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProductos(response.data);
                setFilteredProductos(response.data);
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const response = await axios.get("http://localhost:9000/categorias", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategorias(response.data);
            } catch (error) {
                console.error("Error al obtener categorías:", error);
            }
        };

        fetchCategorias();
        fetchProductos();
    }, [token]);

    const handleFilterChange = (e) => {
        const selectedCategory = e.target.value;
        setFilterCategory(selectedCategory);
        filterProductos(selectedCategory, searchQuery);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterProductos(filterCategory, query);
    };

    const filterProductos = (category, query) => {
        let filtered = [...productos];

        if (category !== "todos") {
            filtered = filtered.filter(
                (producto) => producto.categoria_id.toString() === category
            );
        }

        // Filtro por nombre
        if (query) {
            filtered = filtered.filter((producto) =>
                producto.nombre.toLowerCase().includes(query)
            );
        }

        setFilteredProductos(filtered);
    };

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
                setFilteredProductos(updatedProductos);
                alert("Producto eliminado correctamente.");
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                alert("Error al eliminar el producto.");
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/adminPanel/productos/editar/${id}`);
    };

    return (
        <div className="productos-page">
            <h1>Lista de Productos</h1>

            <div className="filters">
                <label htmlFor="filterCategory">Filtrar por categoría:</label>
                <select id="filterCategory" value={filterCategory} onChange={handleFilterChange}>
                    <option value="todos">Todos</option>
                    {Array.isArray(categorias) && categorias.length > 0 ? (
                        categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay categorías disponibles</option>
                    )}
                </select>

                <label htmlFor="searchQuery">Buscar por nombre:</label>
                <input
                    type="text"
                    id="searchQuery"
                    placeholder="Ej: Iphone"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Tabla */}
            {filteredProductos.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Descripción</th>
                            <th>Categoría</th>
                            <th>Vendedor</th>
                            <th>Creado</th>
                            <th>Actualizado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProductos.map((producto) => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>${producto.precio}</td>
                                <td>{producto.descripcion}</td>
                                <td>{producto.categoria.nombre}</td>
                                <td>{producto.vendedor.email}</td>
                                <td>{new Date(producto.created_at).toLocaleString()}</td>
                                <td>{new Date(producto.updated_at).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleEdit(producto.id)}
                                    >
                                        <i className="bi bi-pencil-fill"></i> Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(producto.id)}
                                    >
                                        <i className="bi bi-trash-fill"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-results">No se encontraron productos.</p>
            )}
        </div>
    );
};

export default ProductList;
