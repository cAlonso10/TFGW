import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/UserListAdmin.scss";
import { useNavigate } from "react-router-dom";

const UserList = ({ token }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [filterType, setFilterType] = useState("todos");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get("http://localhost:9000/usuarios", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsuarios(response.data);
                setFilteredUsuarios(response.data);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };

        fetchUsuarios();
    }, [token]);

    const handleFilterChange = (e) => {
        const selectedType = e.target.value;
        setFilterType(selectedType);
        filterUsuarios(selectedType, searchQuery);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterUsuarios(filterType, query);
    };

    const filterUsuarios = (type, query) => {
        let filtered = [...usuarios];

        if (type !== "todos") {
            filtered = filtered.filter((usuario) => usuario.tipo === type);
        }

        if (query) {
            filtered = filtered.filter((usuario) =>
                usuario.email.toLowerCase().includes(query)
            );
        }

        setFilteredUsuarios(filtered);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:9000/usuario/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const updatedUsuarios = usuarios.filter((usuario) => usuario.id !== id);
                setUsuarios(updatedUsuarios);
                setFilteredUsuarios(updatedUsuarios);
                alert("Usuario eliminado correctamente.");
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
                alert("Error al eliminar el usuario.");
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/adminPanel/usuarios/editar/${id}`);
    };

    return (
        <div className="usuarios-page">
            <h1>Lista de Usuarios</h1>

            <div className="filters">
                <label htmlFor="filterType">Filtrar por tipo:</label>
                <select id="filterType" value={filterType} onChange={handleFilterChange}>
                    <option value="todos">Todos</option>
                    <option value="administrador">Administrador</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="cliente">Cliente</option>
                </select>

                <label htmlFor="searchQuery">Buscar por correo:</label>
                <input
                    type="text"
                    id="searchQuery"
                    placeholder="Ej: ejemplo@correo.com"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Tabla */}
            {filteredUsuarios.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Tipo</th>
                            <th>Creado</th>
                            <th>Actualizado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.tipo}</td>
                                <td>{new Date(usuario.created_at).toLocaleString()}</td>
                                <td>{new Date(usuario.updated_at).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleEdit(usuario.id)}
                                    >
                                        <i className="bi bi-pencil-fill"></i> Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(usuario.id)}
                                    >
                                        <i className="bi bi-trash-fill"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-results">No se encontraron usuarios.</p>
            )}
        </div>
    );
};

export default UserList;
