import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosConfig";
import { Bar, Pie, Line } from "react-chartjs-2";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Cargando datos del dashboard...</p>;
  if (!dashboardData) return <p>Error al cargar los datos.</p>;

  const { servicios, reseñas, contrataciones, usuarios } = dashboardData;

  const serviciosPorCategoriaData = {
    labels: servicios.porCategoria.map((cat) => cat._id || "Sin categoría"),
    datasets: [
      {
        label: "Servicios por Categoría",
        data: servicios.porCategoria.map((cat) => cat.total),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };
  

  const serviciosPorPuntuacionData = {
    labels: servicios.porPuntuacion.map((serv) => serv._id || "Sin puntuación"),
    datasets: [
      {
        label: "Servicios por Puntuación",
        data: servicios.porPuntuacion.map((serv) => serv.total),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const reseñasPorPuntuacionData = {
    labels: reseñas.porPuntuacion.map((res) => `${res._id} estrellas`),
    datasets: [
      {
        label: "Reseñas por Puntuación",
        data: reseñas.porPuntuacion.map((res) => res.total),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const usuariosPorMesData = {
    labels: usuarios.porMes.map((mes) => `Mes ${mes._id}`),
    datasets: [
      {
        label: "Usuarios por Mes",
        data: usuarios.porMes.map((mes) => mes.total),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54,162,235,0.2)",
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Estadísticas principales */}
      <div className="bg-white p-4 rounded shadow-md col-span-1 lg:col-span-2 grid grid-cols-4 gap-4">
        <div className="text-center">
          <h2 className="font-bold">Total Servicios</h2>
          <p>{servicios.total}</p>
        </div>
        <div className="text-center">
          <h2 className="font-bold">Total Reseñas</h2>
          <p>{reseñas.total}</p>
        </div>
        <div className="text-center">
          <h2 className="font-bold">Total Contrataciones</h2>
          <p>{contrataciones.total}</p>
        </div>
        <div className="text-center">
          <h2 className="font-bold">Total Usuarios</h2>
          <p>{usuarios.total}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-center font-bold">Servicios por Categoría</h3>
        <Pie data={serviciosPorCategoriaData} />
      </div>
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-center font-bold">Servicios por Puntuación</h3>
        <Bar data={serviciosPorPuntuacionData} />
      </div>
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-center font-bold">Reseñas por Puntuación</h3>
        <Bar data={reseñasPorPuntuacionData} />
      </div>
      <div className="bg-white p-4 rounded shadow-md col-span-1 lg:col-span-2">
        <h3 className="text-center font-bold">Usuarios por Mes</h3>
        <Line data={usuariosPorMesData} />
      </div>
    </div>
  );
};

export default DashboardPage;
