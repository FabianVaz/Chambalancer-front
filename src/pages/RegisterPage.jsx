import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    confirmarContraseña: "",
  });
  const [message, setMessage] = useState(""); // Mensaje de error
  const navigate = useNavigate();

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validar los datos antes de enviar al backend
  const validateForm = () => {
    const { nombre, correo, contraseña, confirmarContraseña } = formData;
    if (!nombre || !correo || !contraseña || !confirmarContraseña) {
      return "Todos los campos son obligatorios";
    }
    if (contraseña !== confirmarContraseña) {
      return "Las contraseñas no coinciden";
    }
    return null;
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    try {
      await axiosInstance.post("http://localhost:5000/api/auth/register", {
        nombre: formData.nombre,
        correo: formData.correo,
        contraseña: formData.contraseña,
        tipo: "cliente", // Siempre cliente para esta página
      });

      navigate("/registration-success"); // Redirige a la página de éxito
    } catch (error) {
      setMessage(
        error.response?.data?.mensaje || "Error al registrarse. Inténtalo de nuevo."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <button
          className="text-blue-500 underline mb-4"
          onClick={() => navigate("/login")}
        >
          Regresar
        </button>
        <h1 className="text-center text-2xl font-bold mb-4">Registro</h1>
        {message && (
          <div className="text-red-600 text-center mb-4">{message}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.correo}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="contraseña"
              placeholder="Contraseña"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.contraseña}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="confirmarContraseña"
              placeholder="Confirmar contraseña"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.confirmarContraseña}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded"
            >
              Registrarme
            </button>
          </div>
          <div className="text-center">
            <button
             className="text-blue-500 underline"
             onClick={() => navigate("/register-provider")}
            >
            Soy proveedor
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
