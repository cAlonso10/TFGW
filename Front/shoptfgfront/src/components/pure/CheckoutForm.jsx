import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/CheckoutForm.scss";

const CheckoutForm = ({ clientSecret, userId, token }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [address, setAddress] = useState(""); 
    const [addressError, setAddressError] = useState(null); 

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!address.trim()) {
            setAddressError("Por favor, introduce una dirección válida.");
            return;
        }

        setAddressError(null);
        
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (result.error) {
            setError(result.error.message);
        } else {
            if (result.paymentIntent.status === "succeeded") {
                setSuccess(true);

                try {
                    
                    const response = await axios.post(
                        "http://localhost:9000/createOrder",
                        {
                            usuario_id: userId,
                            status: "pendiente",
                            direccion: address.trim(),
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    //console.log("Respuesta del servidor:", response.data);
                    navigate("/"); 
                } catch (err) {
                    console.error("Error al crear el pedido:", err);
                    setError("Error al crear el pedido.");
                }
            }
        }
    };

    return (
        <div className="checkout-form">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="address">Dirección de envío:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Introduce tu dirección"
                        required
                    />
                    {addressError && <div className="error">{addressError}</div>}
                </div>
                <CardElement className="StripeElement" />
                <button type="submit" disabled={!stripe}>
                    Pagar
                </button>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">¡Pago realizado con éxito!</div>}
            </form>
        </div>
    );
};

export default CheckoutForm;
