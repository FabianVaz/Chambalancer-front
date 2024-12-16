import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UpdateRequestStatusPage = () => {
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API;

  useEffect(() => {
    const updateRequestStatus = async () => {
      const params = new URLSearchParams(window.location.search);
      const requestId = params.get("id");
    
      if (!requestId) {
        console.error("No se encontró requestId en los parámetros de la URL.");
        return navigate("/my-requests");
      }
    
      try {
        const response = await fetch(`${apiURL}/api/requests/${requestId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Incluye token si es necesario
          },
          body: JSON.stringify({
            status: "pagada",
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "No se pudo actualizar el estado de la solicitud.");
        }
    
        console.log("Estado actualizado correctamente.");
        navigate("/my-requests");
      } catch (error) {
        console.error("Error al actualizar el estado de la solicitud:", error.message);
      }
    };

    updateRequestStatus();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-xl font-bold">Actualizando el estado de la solicitud...</h1>
    </div>
  );
};

export default UpdateRequestStatusPage;
