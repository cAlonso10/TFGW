import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AddProduct.scss";
import { useNavigate } from "react-router-dom";

const AddProduct = ({ token, userId }) => {
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        imagenes: [],
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    console.log(token)
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get("http://localhost:9000/categorias", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategorias(response.data);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
            }
        };

        fetchCategorias();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imagenes: [...e.target.files] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productResponse = await axios.post("http://localhost:9000/productos", {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precio: formData.precio,
                categoria_id: formData.categoria,
                vendedor_id: userId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (productResponse.status === 201) {
                const productoId = productResponse.data.producto.id;

                if (formData.imagenes.length > 0) {
                    const formDataImages = new FormData();
                    formData.imagenes.forEach((imagen) => {
                        formDataImages.append("imagenes[]", imagen);
                    });

                    await axios.post(`http://localhost:9000/producto/${productoId}/imagenes`, formDataImages, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    });
                }

                alert("Producto añadido correctamente.");
                navigate("/productos/vendedor");
            } else {
                alert("Error al añadir el producto.");
            }
        } catch (error) {
            console.error("Error al añadir el producto:", error);
            alert("Hubo un error al añadir el producto.");
        } finally {
            setLoading(false);
        }
    };
    

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="add-product">
            <h1>Añadir Producto</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Categoría:</label>
                    <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Imágenes:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Añadir Producto
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/productos/vendedor")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
