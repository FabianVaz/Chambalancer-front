import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

const ServiceProviderPage = () => {
  const { serviceId } = useParams(); // Obtener el ID del servicio desde la URL
  const navigate = useNavigate();
  const [service, setService] = useState(null); // Estado para los detalles del servicio
  const [reviews, setReviews] = useState([]); // Estado para las reseñas
  const [error, setError] = useState(false); // Estado para manejar errores
  const [message, setMessage] = useState(""); // Mensaje de confirmación o error

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
        setReviews(response.data || []); // Manejar un array vacío si no hay reseñas
      } catch (error) {
        console.error("Error al obtener las reseñas:", error);
      }
    };

    fetchServiceDetails();
    fetchReviews();
  }, [serviceId]);

  // Manejar la eliminación del servicio
  const handleDeleteService = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este servicio?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/services/${serviceId}`);
      setMessage("Servicio eliminado exitosamente.");
      setTimeout(() => navigate("/provider-profile"), 2000); // Redirigir al perfil del proveedor después de 2 segundos
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
      setMessage("Error al eliminar el servicio. Inténtalo de nuevo.");
    }
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
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded" disabled>
            Notificaciones
          </button>
          <button className="text-blue-600 bg-white border border-gray-300 py-2 px-4 rounded" disabled>
            Menú
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow-md rounded">
        {message && (
          <div
            className={`text-center mb-4 ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </div>
        )}

        {/* Información del servicio */}
        <div className="flex items-start space-x-4">
          <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400">Img</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{service.nombre}</h1>
            <p className="text-gray-600">Categoría: {service.categoría}</p>
            <p className="text-gray-600">Costo: ${service.precio}</p>
            <p className="text-gray-600">Puntuación: {service.puntuación || "N/A"}</p>
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-6">
          <h3 className="text-lg font-bold">Descripción</h3>
          <p>{service.descripción}</p>
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
                <p>{review.texto}</p>
                <p className="text-sm text-gray-600">Cliente: {review.cliente?.nombre}</p>
                <p className="text-sm text-gray-600">Fecha: {new Date(review.fechaResena).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Puntuación: {review.puntuacion || "Sin puntuación"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">Este servicio no tiene reseñas.</p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => navigate(`/edit-service/${serviceId}`)}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Editar Servicio
          </button>
          <button
            onClick={handleDeleteService}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Eliminar Servicio
          </button>
        </div>
      </main>
    </div>
  );
};

export default ServiceProviderPage;
