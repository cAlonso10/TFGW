import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/ProductList.scss";

const ProductList = ({ token, searchQuery }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigate = useNavigate();

    // Obtener categorías
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:9000/categorias", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    // Obtener productos
    const fetchProducts = async () => {
        setLoading(true);
        setNoResults(false);

        try {
            let url = "http://localhost:9000/productos";
            if (searchQuery) {
                url = `http://localhost:9000/productos/search/${searchQuery}`;
            } else if (selectedCategory) {
                url = `http://localhost:9000/productos/categoria/${selectedCategory}`;
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProducts(response.data);
            setNoResults(response.data.length === 0);
        } catch (error) {
            console.error("Error al buscar productos:", error);
            setNoResults(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [searchQuery, token, selectedCategory]);

    return (
        <div>
            <h1>Lista de Productos</h1>
            <div className="filter-category">
                <label htmlFor="category-select">Filtrar por Categoría:</label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Todas</option>
                    {categories.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : noResults ? (
                <p>No se han encontrado resultados, prueba con otra búsqueda.</p>
            ) : (
                <ul className="product-list">
                    {products.map((producto) => (
                        <li
                            key={producto.id}
                            className="product-item"
                            onClick={() => navigate(`/product/${producto.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            {producto.imagenes?.[0]?.url && (
                                <img
                                    src={producto.imagenes[0].url}
                                    alt={producto.nombre}
                                    style={{ width: "auto", height: "150px", marginBottom: "10px" }}
                                />
                            )}
                            <h3>{producto.nombre}</h3>
                            <p>Descripción: {producto.descripcion}</p>
                            <p>Precio: ${producto.precio}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductList;
