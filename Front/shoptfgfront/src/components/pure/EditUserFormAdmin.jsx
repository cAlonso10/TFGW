import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/EditUserFormAdmin.scss";

const EditUserForm = ({ token }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/usuario/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsuario(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
                setLoading(false);
            }
        };

        fetchUsuario();
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usuarioData = { ...usuario };
        delete usuarioData.password; // Eliminamos la contraseña si no se actualiza

        try {
            await axios.put(
                `http://localhost:9000/usuario/${id}`,
                usuarioData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Usuario actualizado correctamente.");
            navigate("/adminPanel/usuarios");
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            alert("Error al actualizar el usuario.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="edit-user">
            <h1>Editar Usuario</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre: </label>
                    <input
                        type="text"
                        name="nombre"
                        value={usuario.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        name="email"
                        value={usuario.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Tipo: </label>
                    <select
                        name="tipo"
                        value={usuario.tipo}
                        onChange={handleChange}
                        required
                    >
                        <option value="administrador">Administrador</option>
                        <option value="vendedor">Vendedor</option>
                        <option value="cliente">Cliente</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/adminPanel/usuarios")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditUserForm;
