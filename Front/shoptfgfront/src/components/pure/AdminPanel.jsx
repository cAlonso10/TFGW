import React, { useEffect, useState } from "react";
import "../../styles/AdminPanel.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = ({ token }) => {
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [totalPedidos, setTotalPedidos] = useState(0);
    const [totalPedidosPendientes, setTotalPedidosPendientes] = useState(0);
    const [totalProductos, setTotalProductos] = useState(0);
    const [totalCategorias, setTotalCategorias] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTotalUsuarios = async () => {
            try {
                const response = await axios.get("http://localhost:9000/totalUsuarios", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalUsuarios(response.data.totalUsuarios);
            } catch (error) {
                console.error("Error al obtener el total de usuarios:", error);
            }
        };

        const fetchTotalPedidos = async () => {
            try {
                const response = await axios.get("http://localhost:9000/totalPedidos", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalPedidos(response.data.totalPedidos);
            } catch (error) {
                console.error("Error al obtener el total de pedidos:", error);
            }
        };

        const fetchTotalPedidosPendientes = async () => {
            try {
                const response = await axios.get("http://localhost:9000/totalPedidosPendientes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalPedidosPendientes(response.data.totalPedidosPendientes);
            } catch (error) {
                console.error("Error al obtener el total de pedidos pendientes:", error);
            }
        };

        const fetchTotalProductos = async () => {
            try {
                const response = await axios.get("http://localhost:9000/totalProductos", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalProductos(response.data.totalProductos);
            } catch (error) {
                console.error("Error al obtener el total de productos:", error);
            }
        };

        const fetchTotalCategorias = async () => {
            try {
                const response = await axios.get("http://localhost:9000/totalCategorias", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalCategorias(response.data.totalCategorias);
            } catch (error) {
                console.error("Error al obtener el total de categorías:", error);
            }
        };

        // Ejecutar todas las solicitudes
        fetchTotalUsuarios();
        fetchTotalPedidos();
        fetchTotalPedidosPendientes();
        fetchTotalProductos();
        fetchTotalCategorias();
    }, [token]);

    return (
        <div className="admin-panel">
            <h1>Panel de Administración</h1>
            <div className="info-boxes">
                <div className="info-box" onClick={() => navigate("/adminPanel/usuarios")}>
                    <h2>Usuarios</h2>
                    <p>Usuarios registrados: {totalUsuarios}</p>
                </div>
                <div className="info-box" onClick={() => navigate("/adminPanel/pedidos")}>
                    <h2>Pedidos</h2>
                    <p>Pedidos totales: {totalPedidos}</p>
                    <p>Pedidos pendientes: {totalPedidosPendientes}</p>
                </div>
            </div>
            <div className="info-buttons">
                <div className="info-box" onClick={() => navigate("/adminPanel/productos")}>
                    <h3>Productos</h3>
                    <p>Productos disponibles: {totalProductos}</p>
                </div>
                <div className="info-box" onClick={() => navigate("/adminPanel/categorias")}>
                    <h3>Categorías</h3>
                    <p>Categorías disponibles: {totalCategorias}</p>
                </div>
                <div className="info-box">
                    <h3>Otro</h3>
                    <p>Coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
