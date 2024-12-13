import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

const ServiceDetailsPage = () => {
  const { serviceId } = useParams(); // Obtener el ID del servicio desde la URL
  const navigate = useNavigate();
  const [service, setService] = useState(null); // Estado para los detalles del servicio
  const [reviews, setReviews] = useState([]); // Estado para las reseñas
  const [error, setError] = useState(false); // Estado para manejar errores

  // Obtener los detalles del servicio desde el backend
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axiosInstance.get(`/services/${serviceId}`);
        setService(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles del servicio:", error);
        setError(true);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/services/${serviceId}/reviews`);
        console.log("Reseñas obtenidas:", response.data); // Log para depurar
        setReviews(response.data || []); // Asegúrate de manejar un array vacío si no hay reseñas
      } catch (error) {
        console.error("Error al obtener las reseñas:", error);
      }
    };

    fetchServiceDetails();
    fetchReviews();
  }, [serviceId]);

  // Manejo del clic en "Solicitar Servicio"
  const handleRequestService = () => {
    navigate("/request-service", { state: { serviceId } });
  };

  if (error) {
    return <p className="text-center mt-8 text-red-600">Error al cargar los detalles del servicio.</p>;
  }

  if (!service) {
    return <p className="text-center mt-8">Cargando datos del servicio...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Regresar
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow-md rounded">
        {/* Información del servicio */}
        <div className="flex items-start space-x-4">
          <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400">Img</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{service.nombre}</h1>
            <p className="text-gray-600">Proveedor: {service.proveedor?.nombre}</p>
            <p className="text-gray-600">Categoría: {service.categoria}</p>
            <p className="text-gray-600">Costo: ${service.precio}</p>
            
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-6">
          <h3 className="text-lg font-bold">Descripción</h3>
          <p>{service.descripcion}</p>
        </div>

        {/* Ubicación */}
        <div className="mt-6">
          <h3 className="text-lg font-bold">Ubicación</h3>
          <p>{service.ubicacion}</p>
        </div>

        {/* Reseñas */}
        <div className="mt-6">
          <h3 className="text-lg font-bold">Reseñas</h3>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="mb-4 border-b pb-4">
                <h4 className="font-bold">{review.titulo}</h4>
                <p>{review.descripcion}</p>
                <p className="text-sm text-gray-600">Cliente: {review.cliente?.nombre || "Anónimo"}</p>
                <p className="text-sm text-gray-600">
                  Fecha:{" "}
                  {review.fecha
                    ? new Date(review.fecha).toLocaleDateString()
                    : "Sin fecha"}
                </p>
                <p className="text-sm text-gray-600">Puntuación: {review.puntuacion || "Sin puntuación"}</p>
                {review.imagen && (
                  <img
                    src={`http://localhost:5000/${review.imagen.replace(/^\/+/, "")}`}
                    alt="Reseña"
                    className="mt-4 w-full max-w-md rounded"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">Este servicio no tiene reseñas.</p>
          )}
        </div>

        {/* Botón para solicitar contratación */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleRequestService}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Solicitar contratación
          </button>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetailsPage;
