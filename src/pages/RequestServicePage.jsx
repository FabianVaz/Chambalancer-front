import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

const RequestServicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API;

  // Obtén `serviceId` de la `state` enviada desde ServiceDetailsPage
  const serviceId = location.state?.serviceId;


  if (!serviceId) {
    console.error("No se recibió el serviceId");
  }

  const [formData, setFormData] = useState({
    lugar: "",
    presupuesto: "",
    descripcion: "", // Cambiado a `descripcion` sin tilde
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.lugar || !formData.presupuesto || !formData.descripcion) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const data = {
      servicioId: serviceId, // Usar el serviceId recibido
      lugar: formData.lugar,
      presupuesto: formData.presupuesto,
      descripcion: formData.descripcion, // Cambiado a "descripcion"
    };

    console.log("Datos enviados al backend:", data);

    try {
      const response = await axiosInstance.post(`${apiURL}/api/requests`, data);
      console.log("Solicitud creada:", response.data);
      navigate("/my-requests");
    } catch (error) {
      console.error(
        "Error al enviar la solicitud:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.mensaje ||
          "Hubo un error al enviar la solicitud. Inténtalo de nuevo."
      );
    }
  };

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
          <button
            className="text-blue-600 bg-white border border-gray-300 py-2 px-4 rounded"
            disabled
          >
            Menú
          </button>
        </div>
      </header>

      {/* Formulario para solicitar el servicio */}
      <main className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-md rounded">
        <h1 className="text-xl font-bold mb-4">Solicitar Servicio</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Lugar</label>
            <input
              type="text"
              name="lugar"
              value={formData.lugar}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Presupuesto</label>
            <input
              type="number"
              name="presupuesto"
              value={formData.presupuesto}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Descripción</label>
            <textarea
              name="descripcion" // Cambiado a `descripcion` sin tilde
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
              placeholder="Descripción del servicio"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Enviar Solicitud
          </button>
        </form>
      </main>
    </div>
  );
};

export default RequestServicePage;
