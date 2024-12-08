import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearch, token }) => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); 
            onSearch(query); 
            navigate("/"); 
        }
    };

    return (
        <input
            type="text"
            placeholder="Busca un producto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress} 
            style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
        />
    );
};

export default SearchBar;
