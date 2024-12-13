import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosConfig";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [services, setServices] = useState([]); // Lista completa de servicios
  const [filteredServices, setFilteredServices] = useState([]); // Servicios filtrados
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [selectedCategory, setSelectedCategory] = useState(""); // Categoría seleccionada
  const [categories, setCategories] = useState([]); // Lista de categorías
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controla el menú desplegable
  const navigate = useNavigate();

  // Función para obtener servicios del backend
  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:5000/api/services");
      setServices(response.data);
      setFilteredServices(response.data); // Inicializa con todos los servicios
      const uniqueCategories = [
        ...new Set(response.data.map((service) => service.categoría)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = services.filter(
      (service) =>
        service.nombre.toLowerCase().includes(term) ||
        service.descripción.toLowerCase().includes(term)
    );

    // Filtrar adicionalmente por categoría si está seleccionada
    setFilteredServices(
      selectedCategory
        ? filtered.filter((service) => service.categoría === selectedCategory)
        : filtered
    );
  };

  // Función para manejar el filtro por categoría
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setIsMenuOpen(false); // Cierra el menú desplegable

    const filtered = services.filter((service) =>
      category ? service.categoría === category : true
    );

    // Filtrar adicionalmente por el término de búsqueda si existe
    setFilteredServices(
      searchTerm
        ? filtered.filter(
            (service) =>
              service.nombre.toLowerCase().includes(searchTerm) ||
              service.descripción.toLowerCase().includes(searchTerm)
          )
        : filtered
    );
  };

  // Cargar servicios al montar el componente
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </button>
        <div className="flex items-center space-x-2 mx-auto">
          <input
            type="text"
            placeholder="Buscar"
            className="border border-gray-300 rounded p-2 w-64"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="relative">
            <button
              className="text-blue-600 bg-white border border-gray-300 rounded p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              Categoría
            </button>
            {isMenuOpen && (
              <div className="absolute bg-white shadow-md mt-2 rounded w-48 z-10">
                <button
                  className="block text-left w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => handleCategoryFilter("")}
                >
                  Cualquier categoría
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
        <div></div> {/* Elemento vacío para alinear el diseño */}
      </header>

      {/* Services List */}
      <main className="max-w-4xl mx-auto mt-6">
        {filteredServices.length === 0 ? (
          <p className="text-center text-gray-600">
            No se encontraron servicios.
          </p>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white shadow-md rounded p-4 mb-4 flex justify-between items-center"
            >
              {/* Placeholder de imagen */}
              <div className="bg-gray-200 w-16 h-16 rounded flex items-center justify-center">
                <span className="text-gray-400">Img</span>
              </div>
              {/* Detalles del servicio */}
              <div className="flex-1 ml-4">
                <h2 className="font-bold text-lg">{service.nombre}</h2>
                <p className="text-gray-600">Proveedor: {service.proveedor.nombre}</p>
                <p className="text-gray-600">{service.descripción}</p>
                <p className="text-gray-600 font-bold">{service.categoría}</p>
              </div>
              {/* Precio y puntuación */}
              <div className="text-right">
                <p className="font-bold">Costo: ${service.precio}</p>
                <p className="text-gray-600">Puntuación: {service.puntuación || "N/A"}</p>
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded mt-2"
                  onClick={() => navigate("/login")}
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

export default HomePage;
