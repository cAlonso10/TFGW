import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/CategoriesListAdmin.scss";

const CategoriesListAdmin = ({ token }) => {
    const [categorias, setCategorias] = useState([]);
    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get("http://localhost:9000/categorias", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCategorias(response.data);
            } catch (error) {
                console.error("Error al obtener categorías:", error);
            }
        };

        fetchCategorias();
    }, [token]);

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            const response = await axios.post(
                "http://localhost:9000/categorias",
                { nombre: newCategory },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCategorias((prevCategorias) => [...prevCategorias, response.data.categoria]);
            setNewCategory("");
        } catch (error) {
            console.error("Error al añadir la categoría:", error);
            alert("Error al añadir la categoría.");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

        try {
            await axios.delete(`http://localhost:9000/categoria/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCategorias((prevCategorias) => prevCategorias.filter((cat) => cat.id !== id));
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            alert("Error al eliminar la categoría.");
        }
    };

    return (
        <div className="categories-admin">
            <h1>Lista de Categorías</h1>
            <div className="add-category">
                <input
                    type="text"
                    placeholder="Nueva categoría"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button onClick={handleAddCategory} className="btn btn-primary">
                    Añadir
                </button>
            </div>

            {Array.isArray(categorias) && categorias.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id}>
                                <td>{categoria.id}</td>
                                <td>{categoria.nombre}</td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteCategory(categoria.id)}
                                        className="btn btn-danger"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-results">No hay categorías disponibles.</p>
            )}
        </div>
    );
};

export default CategoriesListAdmin;
