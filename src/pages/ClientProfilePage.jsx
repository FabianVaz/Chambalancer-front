import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";


const ClientProfilePage = () => {
  const [clientInfo, setClientInfo] = useState(null); // Datos del cliente
  const [reviews, setReviews] = useState([]); // Lista de reseñas
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  // Obtener información del cliente y sus reseñas desde el backend
  const fetchClientData = async () => {
    try {
      // Obtener información del cliente
      const clientResponse = await axiosInstance.get("/auth/me");
      setClientInfo(clientResponse.data);

      // Obtener las reseñas del cliente
      const reviewsResponse = await axiosInstance.get(
        `/reviews?clientId=${clientResponse.data._id}`
      );
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error("Error al obtener datos del cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  if (loading) {
    return <p className="text-center">Cargando...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Perfil de {clientInfo?.nombre || "Cliente"}
        </h1>
        <button
          onClick={() => navigate("/client-home")}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Regresar
        </button>
      </header>

      <main className="max-w-4xl mx-auto mt-6 p-4 space-y-4">
        {/* Información del cliente */}
        <section className="bg-white shadow-md rounded p-4">
          <h2 className="text-lg font-bold mb-2">Información del cliente</h2>
          <p>
            <strong>Nombre:</strong> {clientInfo?.nombre || "N/A"}
          </p>
          <p>
            <strong>Correo:</strong> {clientInfo?.correo || "N/A"}
          </p>
        </section>

        {/* Reseñas del cliente */}
        <section className="bg-white shadow-md rounded p-4">
          <h2 className="text-lg font-bold mb-2">Tus reseñas</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No tienes reseñas.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 border border-gray-200 rounded shadow-sm"
                >
                  <p>
                    <strong>Título:</strong> {review.titulo || "N/A"}
                  </p>
                  <p>
                    <strong>Servicio:</strong> {review.servicio?.nombre || "N/A"}
                  </p>
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {review.descripcion || "N/A"}
                  </p>
                  <p>
                    <strong>Puntuación:</strong>{" "}
                    {review.puntuacion ? `${review.puntuacion}/5` : "N/A"}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(review.fecha).toLocaleDateString() || "N/A"}
                  </p>
                  {review.imagen && (
  <div className="mt-4">
    {console.log(`URL de la imagen generada: http://localhost:5000/${review.imagen.replace(/^\/+/, '')}`)}
    <img
      src={`http://localhost:5000/${review.imagen.replace(/^\/+/, '')}`}
      alt="Imagen de reseña"
      className="w-full max-w-sm rounded"
    />
  </div>
)}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ClientProfilePage;
