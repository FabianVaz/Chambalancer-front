import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";

const ProviderRequestPage = () => {
  const [requests, setRequests] = useState([]); // Estado para almacenar las solicitudes
  const [error, setError] = useState(false); // Estado para manejar errores
  const apiURL = process.env.REACT_APP_API;

  // Obtener solicitudes asociadas al proveedor autenticado
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get(`${apiURL}/api/requests/provider`);
        // Filtrar solicitudes para excluir las canceladas y rechazadas
        const filteredRequests = response.data.filter(
          (request) => request.estado !== 3 && request.estado !== 4
        );
        setRequests(filteredRequests);
      } catch (error) {
        console.error("Error al obtener las solicitudes:", error);
        setError(true);
      }
    };

    fetchRequests();
  }, []);

  const handleChangeState = async (requestId, newState) => {
    try {
      const confirmAction = window.confirm(
        newState === 4
          ? "¿Estás seguro de que quieres cancelar esta solicitud?"
          : newState === 3
          ? "¿Estás seguro de que quieres rechazar esta solicitud?"
          : "¿Quieres cambiar el estado de esta solicitud?"
      );
      if (!confirmAction) return;

      await axiosInstance.patch(`${apiURL}/api/requests/${requestId}`, { estado: newState });

      // Actualizar solicitudes y excluir las canceladas y rechazadas
      setRequests((prevRequests) =>
        prevRequests
          .map((req) => (req._id === requestId ? { ...req, estado: newState } : req))
          .filter((req) => req.estado !== 3 && req.estado !== 4)
      );
    } catch (error) {
      console.error("Error al actualizar el estado de la solicitud:", error);
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 1:
        return "Pendiente";
      case 2:
        return "Aceptada";
      case 3:
        return "Rechazada";
      case 5:
        return "Pagada";
      case 6:
        return "Completada";
      default:
        return "Estado desconocido";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Solicitudes de Clientes</h1>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => window.history.back()}
        >
          Regresar
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto mt-6">
        {error && (
          <p className="text-center text-red-600">Error al cargar las solicitudes.</p>
        )}
        <div className="grid grid-cols-1 gap-4">
          {requests.length === 0 ? (
            <p className="text-center text-gray-600">No tienes solicitudes actualmente.</p>
          ) : (
            requests.map((request) => (
              <div
                key={request._id}
                className="bg-white shadow-md rounded p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-bold">{request.servicio?.nombre || "Servicio no disponible"}</h2>
                  <p className="text-gray-600">
                    Cliente: {request.cliente?.nombre || "Información no disponible"}
                  </p>
                  <p className="text-gray-500">Estado: {getEstadoTexto(request.estado)}</p>
                  <p className="text-gray-500">Costo: ${request.servicio?.precio}</p>
                  <p className="text-gray-500">Presupuesto: ${request.presupuesto}</p>
                </div>
                <div className="flex space-x-2">
                  {request.estado === 1 && (
                    <>
                      <button
                        className="bg-green-500 text-white py-2 px-4 rounded"
                        onClick={() => handleChangeState(request._id, 2)}
                      >
                        Aceptar
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded"
                        onClick={() => handleChangeState(request._id, 3)}
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  {request.estado === 2 && (
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded"
                      onClick={() => handleChangeState(request._id, 4)}
                    >
                      Cancelar Solicitud
                    </button>
                  )}
                  {request.estado === 5 && (
                    <>
                      
                      <button
                        className="bg-green-500 text-white py-2 px-4 rounded"
                        onClick={() => handleChangeState(request._id, 6)}
                      >
                        Terminar Servicio
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderRequestPage;
