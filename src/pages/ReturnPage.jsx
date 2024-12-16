import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ReturnPage = () => {
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    const fetchSessionStatus = async () => {
      try {
        const response = await fetch(`/api/stripe/session-status?session_id=${sessionId}`);
        const data = await response.json();
        setStatus(data.status);
        setEmail(data.customer_email);
      } catch (error) {
        console.error("Error al obtener el estado de la sesión:", error);
      }
    };

    if (sessionId) {
      fetchSessionStatus();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === "complete" ? (
        <div>
          <h1>¡Pago exitoso!</h1>
          <p>Gracias por tu pago. Se envió un recibo a {email}.</p>
        </div>
      ) : (
        <h1>Procesando tu pago...</h1>
      )}
    </div>
  );
};

export default ReturnPage;
