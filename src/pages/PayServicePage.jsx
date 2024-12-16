import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const apiURL = process.env.REACT_APP_API;

const ProductDisplay = ({ servicio, solicitud }) => {
  const handleCheckout = async () => {
    try {
      const response = await fetch(`${apiURL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: solicitud._id, // ID de la solicitud
          servicio, // Enviar datos del servicio
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirige a Stripe Checkout
      }
    } catch (error) {
      console.error("Error al iniciar el pago:", error);
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg mt-6">
      <div className="flex flex-col items-center">
        <img
          src={servicio.imagen || "https://cdn.pixabay.com/photo/2022/04/04/12/58/customer-support-7111206_640.png"}
          alt={servicio.nombre || "Imagen del servicio"}
          className="w-32 h-32 object-cover rounded-md"
        />
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold text-gray-800">{servicio.nombre}</h3>
          <p className="text-gray-600 mt-2">{servicio.descripción || "Sin descripción disponible"}</p>
          <h5 className="text-xl font-semibold text-blue-600 mt-4">${servicio.precio}</h5>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleCheckout}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-md transition duration-200"
        >
          Realizar Pago
        </button>
      </div>
    </section>
  );
};

const Message = ({ message }) => (
  <section className="max-w-lg mx-auto p-6 bg-green-100 text-green-800 shadow-md rounded-lg mt-6 text-center">
    <p className="text-lg font-semibold">{message}</p>
  </section>
);

const PayServicePage = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { servicio, solicitud } = location.state || {}; // Datos del servicio y solicitud desde MyRequestsPage

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("¡Pedido realizado con éxito! Recibirás un correo de confirmación.");
    }

    if (query.get("canceled")) {
      setMessage("Pedido cancelado. ¡Sigue comprando y vuelve cuando estés listo!");
    }
  }, []);

  if (message) {
    return <Message message={message} />;
  }

  if (!servicio || !solicitud) {
    return (
      <p className="text-center text-red-600 mt-6">
        No se encontraron datos del servicio o solicitud. Por favor, inténtalo de nuevo.
      </p>
    );
  }

  return <ProductDisplay servicio={servicio} solicitud={solicitud} />;
};

export default PayServicePage;
