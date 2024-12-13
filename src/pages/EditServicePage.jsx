import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

const EditServicePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripción: "",
    precio: "",
    ubicación: "",
  });
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  // Obtener detalles del servicio desde el backend
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axiosInstance.get(`/services/${serviceId}`);
        setService(response.data);
        setFormData({
          nombre: response.data.nombre || "",
          descripción: response.data.descripción || "",
          precio: response.data.precio || "",
          ubicación: response.data.ubicacion || "",
        });
      } catch (error) {
        console.error("Error al obtener los detalles del servicio:", error);
        setError(true);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleUpdateService = async (e) => {
    e.preventDefault();
    console.log("Datos enviados al backend:", formData); // Para depuración
    try {
      const response = await axiosInstance.put(`/services/${serviceId}`, formData);
      setMessage("Servicio actualizado exitosamente");
      setTimeout(() => {
        navigate(`/service-provider/${serviceId}`); // Redirigir
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar el servicio:", error.response?.data || error.message);
      setMessage("Error al actualizar el servicio. Inténtalo de nuevo.");
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
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Regresar
        </button>
        <h1 className="text-xl font-bold">Editar Servicio</h1>
      </header>

      <main className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow-md rounded">
        {message && (
          <div className={`text-center mb-4 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleUpdateService}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Descripción</label>
            <textarea
              name="descripción"
              value={formData.descripción}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ubicación</label>
            <input
              type="text"
              name="ubicación"
              value={formData.ubicación}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Actualizar
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditServicePage;
