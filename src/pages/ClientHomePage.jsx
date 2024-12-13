import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosConfig";

const ClientHomePage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [clientName, setClientName] = useState("Cliente");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Obtener los servicios desde el backend
  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("/services");
      setServices(response.data);
      setFilteredServices(response.data);

      const uniqueCategories = [
        ...new Set(response.data.map((service) => service.categoría)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    }
  };

  // Obtener el nombre del cliente desde el backend
  const fetchClientName = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setClientName(response.data.nombre.split(" ")[0]); // Usar solo el primer nombre
    } catch (error) {
      console.error("Error al obtener el nombre del cliente:", error);
    }
  };

  // Manejo de filtrado por categoría
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    const filtered = services.filter(
      (service) =>
        (category ? service.categoría === category : true) &&
        service.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  // Manejo de búsqueda
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = services.filter(
      (service) =>
        (selectedCategory ? service.categoría === selectedCategory : true) &&
        service.nombre.toLowerCase().includes(query)
    );
    setFilteredServices(filtered);
  };

  useEffect(() => {
    fetchServices();
    fetchClientName();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex flex-col md:flex-row md:justify-between items-center">
        <div className="flex items-center justify-center w-full md:w-auto mb-4 md:mb-0">
          <h1 className="text-xl font-bold">Bienvenido, {clientName}</h1>
        </div>
        <div className="flex items-center justify-center w-full md:w-1/2">
          <input
            type="text"
            placeholder="Buscar servicios..."
            className="w-full p-2 border border-gray-300 rounded"
            value={searchQuery}
            onChange={handleSearch}
          />
          <div className="relative ml-2">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Categoría
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute bg-white shadow-md mt-2 rounded w-48 z-20"
                style={{ overflow: "visible", position: "absolute", top: "100%" }}
              >
                <button
                  className="block text-left w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => handleCategoryFilter("")}
                >
                  Todas las categorías
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className="block text-left w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative">
  <button
    className="bg-blue-500 text-white py-2 px-4 rounded"
    onClick={() => setUserMenuOpen(!userMenuOpen)}
  >
    Menú
  </button>
  {userMenuOpen && (
    <div
      ref={userMenuRef}
      className="absolute bg-white shadow-md mt-2 rounded w-48 z-20 right-0" // Alinea a la derecha
    >
      <button
        className="block text-left w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
        onClick={() => navigate("/my-requests")}
      >
        Mis solicitudes
      </button>
      <button
        className="block text-left w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
        onClick={() => navigate("/client-profile")}
      >
        Mi perfil
      </button>
      <button
        className="block text-left w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userType");
          navigate("/login");
        }}
      >
        Cerrar sesión
      </button>
    </div>
  )}
</div>


      </header>

      {/* Lista de servicios */}
      <main className="max-w-4xl mx-auto mt-6 space-y-4">
        {filteredServices.length === 0 ? (
          <p className="text-center text-gray-600">
            No se encontraron servicios.
          </p>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white shadow-md rounded p-4 flex items-center"
            >
              
              {/* Detalles del servicio */}
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-bold">{service.nombre}</h3>
                <p className="text-gray-600 mb-1">
                  Proveedor: {service.proveedor?.nombre}
                </p>
                <p className="text-gray-600">{service.descripción}</p>
              </div>
              {/* Precio y categoría */}
              <div className="text-right">
                <p className="text-gray-500 font-bold mb-1">
                  {service.categoría || "Sin categoría"}
                </p>
                <p className="font-bold">Costo: ${service.precio}</p>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
                  onClick={() => navigate(`/service-details/${service._id}`)}
                >
                  Consultar servicio
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default ClientHomePage;
