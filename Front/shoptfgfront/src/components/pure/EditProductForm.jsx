import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../styles/EditProductForm.scss";

const EditProductForm = ({ token }) => {
    const { id } = useParams();
    const [categorias, setCategorias] = useState([]);
    const [productData, setProductData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
    });
    const [imagenes, setImagenes] = useState([]);
    const [nuevasImagenes, setNuevasImagenes] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/producto/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProductData(response.data);
            } catch (error) {
                console.error("Error al cargar el producto:", error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const response = await axios.get("http://localhost:9000/categorias", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCategorias(response.data);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
            }
        };

        const fetchImagenes = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/producto/${id}/imagenes`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setImagenes(response.data);
            } catch (error) {
                console.error("Error al cargar las imágenes:", error);
            }
        };

        fetchCategorias();
        fetchProduct();
        fetchImagenes();
        setLoading(false);
    }, [id, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        setNuevasImagenes([...e.target.files]);
    };

    const handleImageDelete = async (imagenId) => {
        try {
            await axios.delete(`http://localhost:9000/producto/imagenes/${imagenId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setImagenes(imagenes.filter((img) => img.id !== imagenId));
            alert("Imagen eliminada correctamente.");
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
            alert("Hubo un error al eliminar la imagen.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:9000/producto/${id}`, productData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (nuevasImagenes.length > 0) {
                const formData = new FormData();
                nuevasImagenes.forEach((imagen) => {
                    formData.append("imagenes[]", imagen);
                });

                await axios.post(`http://localhost:9000/producto/${id}/imagenes`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            alert("Producto actualizado correctamente.");
            if (location.pathname.includes("/adminPanel/productos/editar")) {
                navigate("/adminPanel/productos");
            } else if (location.pathname.includes("/productos/editar")) {
                navigate("/productos/vendedor");
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            alert("Hubo un error al actualizar el producto.");
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="edit-product">
            <h1>Editar Producto</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={productData.nombre}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="precio"
                        value={productData.precio}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={productData.descripcion}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Categoría:</label>
                    <select
                        name="categoria_id"
                        value={productData.categoria_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Imágenes actuales:</label>
                    <ul className="current-images">
                        {imagenes.map((img) => (
                            <li key={img.id}>
                                <img src={img.url} alt="Producto" />
                                <button
                                    type="button"
                                    onClick={() => handleImageDelete(img.id)}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <label>Subir nuevas imágenes:</label>
                    <input type="file" multiple onChange={handleImageUpload} />
                </div>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                        if (location.pathname.includes("/adminPanel/productos/editar")) {
                            navigate("/adminPanel/productos");
                        } else if (location.pathname.includes("/productos/editar")) {
                            navigate("/productos/vendedor");
                        }
                    }}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditProductForm;
