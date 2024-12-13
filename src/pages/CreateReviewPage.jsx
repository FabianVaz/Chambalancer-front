import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

const CreateReviewPage = () => {
  const { requestId } = useParams(); // Obtén el ID de la solicitud desde la URL
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState({
    titulo: "",
    puntuacion: "",
    descripcion: "",
    imagen: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setReviewData((prevData) => ({
      ...prevData,
      imagen: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", reviewData.titulo);
    formData.append("puntuacion", reviewData.puntuacion);
    formData.append("descripcion", reviewData.descripcion); // Enviar descripcion correctamente
    if (reviewData.imagen) {
        formData.append("imagen", reviewData.imagen);
    }
    formData.append("requestId", requestId);

    try {
        await axiosInstance.post("/reviews", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // Actualiza la solicitud
        await axiosInstance.patch(`/requests/${requestId}`, { estado: 7 });

        alert("Reseña publicada exitosamente.");
        navigate("/my-requests");
    } catch (error) {
        console.error("Error al publicar la reseña:", error);
        alert("Hubo un error al publicar la reseña. Inténtalo de nuevo.");
    }
};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="bg-white shadow-md p-4 w-full text-center">
        <h1 className="text-xl font-bold">Crear Reseña</h1>
      </header>
      <main className="max-w-4xl mx-auto mt-6 w-full p-4">
        <form
          className="bg-white shadow-md rounded p-4 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="flex space-x-4 items-center">
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
              {reviewData.imagen ? (
                <img
                  src={URL.createObjectURL(reviewData.imagen)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Imagen</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="py-2 px-4 border border-gray-300 rounded"
            />
          </div>
          <input
            type="text"
            name="titulo"
            placeholder="Título de la reseña"
            value={reviewData.titulo}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <select
            name="puntuacion"
            value={reviewData.puntuacion}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Seleccionar puntuación</option>
            {[1, 2, 3, 4, 5].map((puntuacion) => (
              <option key={puntuacion} value={puntuacion}>
                {puntuacion} estrella{puntuacion > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={reviewData.descripcion}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows={5}
            required
          />
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Publicar reseña
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateReviewPage;
