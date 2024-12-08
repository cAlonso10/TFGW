import React from "react";

const NotFound = () => {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404</h1>
            <p>La página que estás buscando no existe.</p>
            <a href="/" style={{ color: "blue", textDecoration: "underline" }}>Volver al inicio</a>
        </div>
    );
};

export default NotFound;
