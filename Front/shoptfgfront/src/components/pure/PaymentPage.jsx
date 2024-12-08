import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_51NDVc9G22hZPLa1nAftcMtwSHmw06EOnlpvaxXsGuvnWYJS7A7mwAYkb175LakMOtC8fo2pNG9SalDRvb3VFQdjD00jL8301tN");

const PaymentPage = ({ token }) => {
    const { state } = useLocation();
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:9000/createPaymentIntent",
                    { amount: state.total * 100 },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setClientSecret(response.data.clientSecret);
            } catch (error) {
                console.error("Error al crear el Payment Intent:", error);
            }
        };

        createPaymentIntent();
    }, [state.total, token]);

    return (
        <div>
            <h1>Pagar</h1>
            {clientSecret && (
                <Elements stripe={stripePromise}>
                    <CheckoutForm clientSecret={clientSecret} userId={state.userId} token={token} />
                </Elements>
            )}
        </div>
    );
};

export default PaymentPage;
