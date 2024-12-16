import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const apiURL = process.env.REACT_APP_API;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirige a tu página de éxito o muestra un mensaje
        return_url: `${apiURL}/api/my-requests`, // Opcional: si decides habilitar redirecciones
      },
    });

    if (error) {
      console.error("Error al confirmar el pago:", error);
      alert(error.message);
    } else {
      alert("¡Pago exitoso!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Pagar
      </button>
    </form>
  );
};

export default CheckoutForm;
