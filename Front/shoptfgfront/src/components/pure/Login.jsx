import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "../../styles/Login.scss";

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); 

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post("http://localhost:9000/login", { email, password });
            const token = response.data.token;
            const userId = response.data.userId;
            if (token) {
                setToken(token);
                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);
                navigate("/");
            } else {
                console.error("No se recibió el token desde el backend");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Credenciales incorrectas.");
            } else {
                setErrorMessage("Error al iniciar sesión. Por favor, intenta de nuevo.");
            }
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h1>Tienda</h1>
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
                <button type="submit">Acceder</button>
                <button type="button" onClick={() => navigate("/register")}>Registrarse</button>
                {errorMessage && <p>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default Login;
