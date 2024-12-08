import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Register.scss";

const Register = ({token}) => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (password !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:9000/register", { nombre, email, password });
            if (response.data.message === "Usuario registrado con éxito.") {
                alert("Usuario registrado con éxito");
                navigate("/login");
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Error al registrar. Por favor, verifica los datos e inténtalo de nuevo.");
            }
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit}>
                <h1>Registro</h1>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className="toggle-password-btn"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? (
                            <i className="bi bi-eye-slash"></i>
                        ) : (
                            <i className="bi bi-eye"></i>
                        )}
                    </span>
                </div>
                <div className="password-container">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                        className="toggle-password-btn"
                        onClick={toggleConfirmPasswordVisibility}
                    >
                        {showConfirmPassword ? (
                            <i className="bi bi-eye-slash"></i>
                        ) : (
                            <i className="bi bi-eye"></i>
                        )}
                    </span>
                </div>
                <button type="submit">Registrarse</button>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
        </div>
    );
};

export default Register;
