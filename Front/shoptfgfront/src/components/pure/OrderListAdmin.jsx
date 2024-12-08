import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/OrderListAdmin.scss";

const OrderList = ({ token }) => {
    const [pedidos, setPedidos] = useState([]);
    const [filteredPedidos, setFilteredPedidos] = useState([]);
    const [filterStatus, setFilterStatus] = useState("todos");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get("http://localhost:9000/pedidos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPedidos(response.data);
                setFilteredPedidos(response.data);
            } catch (error) {
                console.error("Error al obtener pedidos:", error);
            }
        };

        fetchPedidos();
    }, [token]);

    const handleFilterChange = (e) => {
        const selectedStatus = e.target.value;
        setFilterStatus(selectedStatus);
        filterPedidos(selectedStatus, searchQuery);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterPedidos(filterStatus, query);
    };

    const filterPedidos = (status, query) => {
        let filtered = [...pedidos];

        if (status !== "todos") {
            filtered = filtered.filter((pedido) => pedido.status === status);
        }

        if (query) {
            filtered = filtered.filter((pedido) =>
                pedido.usuario.email.toLowerCase().includes(query)
            );
        }

        setFilteredPedidos(filtered);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este pedido?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:9000/pedido/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const updatedPedidos = pedidos.filter((pedido) => pedido.id !== id);
                setPedidos(updatedPedidos);
                setFilteredPedidos(updatedPedidos);
                alert("Pedido eliminado correctamente.");
            } catch (error) {
                console.error("Error al eliminar el pedido:", error);
                alert("Error al eliminar el pedido.");
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/adminPanel/pedidos/editar/${id}`);
    };

    return (
        <div className="order-list">
            <h1>Lista de Pedidos</h1>

            <div className="filters">
                <label htmlFor="filterStatus">Filtrar por estado:</label>
                <select id="filterStatus" value={filterStatus} onChange={handleFilterChange}>
                    <option value="todos">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                </select>

                <label htmlFor="searchQuery">Buscar por correo:</label>
                <input
                    type="text"
                    id="searchQuery"
                    placeholder="Ej: admin@admin.com"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {filteredPedidos.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Creado</th>
                            <th>Actualizado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPedidos.map((pedido) => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>{pedido.usuario.email}</td>
                                <td>{pedido.amount}€</td>
                                <td>{pedido.status}</td>
                                <td>{new Date(pedido.created_at).toLocaleString()}</td>
                                <td>{new Date(pedido.updated_at).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleEdit(pedido.id)}
                                    >
                                        <i className="bi bi-pencil-fill"></i> Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(pedido.id)}
                                    >
                                        <i className="bi bi-trash-fill"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-results">No se encontraron pedidos.</p>
            )}
        </div>
    );
};

export default OrderList;
