import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API;

  const estadoTexto = {
    1: "Pendiente",
    2: "Aceptada",
    3: "Rechazada",
    4: "Cancelada",
    5: "Pagada",
    6: "Completada",
    7: "Reseñada", // Nuevo estado
  };

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get(`${apiURL}/api/requests`);
      const activeRequests = response.data.filter((request) => request.estado !== 4);
      setRequests(activeRequests);
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm("¿Estás seguro de que quieres cancelar esta solicitud?")) {
      return;
    }

    try {
      await axiosInstance.patch(`${apiURL}/api/requests/${requestId}`, { estado: 4 });
      setRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
    } catch (error) {
      console.error("Error al cancelar la solicitud:", error);
      alert("Hubo un error al cancelar la solicitud. Inténtalo de nuevo.");
    }
  };

  const handlePaymentRequest = async (requestId) => {
    try {
      const newState = 5; // Estado "Pagada"
      await axiosInstance.patch(`${apiURL}/api/requests/${requestId}`, { estado: newState });

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, estado: newState } : request
        )
      );

      navigate(`/pay-service/${requestId}`);
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      alert("Hubo un error al actualizar la solicitud. Inténtalo de nuevo.");
    }
  };

  const handleReviewRequest = async (requestId) => {
    try {
      const newState = 7; // Estado "Reseñada"
      await axiosInstance.patch(`${apiURL}/api/requests/${requestId}`, { estado: newState });

      // Actualizar localmente el estado de la solicitud
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, estado: newState } : request
        )
      );

      // Redirigir a la página de creación de reseñas
      navigate(`/create-review/${requestId}`);
    } catch (error) {
      console.error("Error al cambiar el estado a 'Reseñada':", error);
      alert("Hubo un error al reseñar la solicitud. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Mis Solicitudes</h1>
        <button
          onClick={() => navigate("/client-home")}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Regresar
        </button>
      </header>

      <main className="max-w-4xl mx-auto mt-6">
        {requests.length === 0 ? (
          <p className="text-center text-gray-600">No tienes solicitudes realizadas.</p>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="bg-white shadow-md rounded p-4 mb-4">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{request.servicio.nombre}</h3>
                  <p className="text-gray-600">{request.servicio.descripción}</p>
                  <p className="text-gray-600">Estado: {estadoTexto[request.estado]}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-600 font-bold">Proveedor: {request.servicio.proveedor?.nombre}</p>
                <p className="text-gray-600">Categoría: {request.servicio.categoría}</p>
                <p className="text-gray-600 font-bold">Costo del servicio: ${request.servicio.precio}</p>
                <p className="text-gray-600 font-bold">Presupuesto: ${request.presupuesto}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(request.estado === 1 || request.estado === 2) && (
                  <button
                    onClick={() => handleCancelRequest(request._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded"
                  >
                    Cancelar solicitud
                  </button>
                )}
                {request.estado === 2 && (
                  <button
                    onClick={() => handlePaymentRequest(request._id)}
                    className="bg-green-500 text-white py-2 px-4 rounded"
                  >
                    Generar Pago
                  </button>
                )}
                {request.estado === 6 && (
                  <button
                    onClick={() => handleReviewRequest(request._id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Reseñar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default MyRequestsPage;

