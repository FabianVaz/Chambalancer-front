import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';

const ProviderProfilePage = () => {
  const [user, setUser] = useState({ nombre: '', correo: '' }); // Datos del proveedor
  const [services, setServices] = useState([]); // Últimos dos servicios publicados
  const [menuOpen, setMenuOpen] = useState(false); // Estado para el menú desplegable
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const apiURL = process.env.REACT_APP_API;

  // Manejo de cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login'); // Redirige al login
  };

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        // Obtener los datos del usuario actual
        const userResponse = await axiosInstance.get(`${apiURL}/api/auth/me`);
        setUser(userResponse.data);

        // Obtener los servicios del proveedor
        const servicesResponse = await axiosInstance.get(`${apiURL}/api/services/my-services`);
        setServices(lastTwoServices);
      } catch (error) {
        console.error('Error al cargar datos:', error.response?.data || error.message);
        setError('Hubo un problema al cargar los datos. Inténtalo más tarde.');
      }
    };

    fetchProviderData();

    // Cerrar menú al hacer clic fuera
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Perfil del Proveedor</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <button
              className="text-blue-600 bg-white border border-gray-300 py-2 px-4 rounded"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Menú
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 bg-white shadow-md border border-gray-300 rounded py-2"
              >
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => navigate('/provider-requests')}
                >
                  Mis Solicitudes
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded"
            onClick={() => navigate('/publish-service')}
          >
            Publicar Servicio
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto mt-6">
        {/* Información del Proveedor */}
        <div className="bg-white shadow-md rounded p-6 flex items-center space-x-6 mb-8">
          {/* Detalles del Proveedor */}
          <div>
            <h2 className="text-xl font-bold">{user.nombre || 'Nombre del Proveedor'}</h2>
            <p className="text-gray-600">{user.correo || 'correo@ejemplo.com'}</p>
          </div>
        </div>

        {/* Servicios Publicados */}
        <div className="bg-white shadow-md rounded p-6">
          <h3 className="text-lg font-bold mb-4">Tus Servicios Publicados</h3>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : services.length === 0 ? (
            <p className="text-gray-600">No tienes servicios publicados.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-gray-50 border border-gray-300 rounded shadow-md p-4"
                >
                  <h4 className="text-lg font-bold">{service.nombre}</h4>
                  <p className="text-gray-600">{service.descripción}</p>
                  <p className="text-gray-500">Precio: ${service.precio.toLocaleString()} MXN</p>
                  <p className="text-gray-500">Ubicación: {service.ubicacion}</p>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
                    onClick={() => navigate(`/service-provider/${service._id}`)}
                  >
                    Consultar Servicio
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderProfilePage;
