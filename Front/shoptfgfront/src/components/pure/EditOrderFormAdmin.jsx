import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/EditOrderFormAdmin.scss";

const EditOrderForm = ({ token }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/pedido/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPedido(response.data);
            } catch (error) {
                console.error("Error al obtener el pedido:", error);
            }
        };

        fetchPedido();
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `http://localhost:9000/pedido/${id}`,
                pedido,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Pedido actualizado correctamente.");
            navigate("/adminPanel/pedidos");
        } catch (error) {
            console.error("Error al actualizar el pedido:", error);
            alert("Error al actualizar el pedido.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPedido({ ...pedido, [name]: value });
    };

    if (!pedido) return <p>Cargando...</p>;

    return (
        <div className="edit-order">
            <h1>Editar Pedido</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Estado:</label>
                    <select
                        name="status"
                        value={pedido.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/adminPanel/pedidos")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditOrderForm;
