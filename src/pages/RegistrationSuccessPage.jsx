import React from "react";
import { useNavigate } from "react-router-dom";

const RegistrationSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center w-96">
        <h1 className="text-2xl font-bold mb-4">¡Registro exitoso!</h1>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => navigate("/login")}
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;
