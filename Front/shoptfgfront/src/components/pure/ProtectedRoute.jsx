import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ isAuthenticated, requiredRole, token, children }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole) {
        try {
            const decodedToken = jwtDecode(token);

            if (decodedToken.tipo !== requiredRole) {
                return <Navigate to="/" />; 
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            return <Navigate to="/login" />;
        }
    }

    return children;
};

export default ProtectedRoute;
