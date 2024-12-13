import React, { useEffect, useRef } from "react";
import { Chart, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, BarElement, PieController } from "chart.js";

Chart.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend, BarElement, PieController);

const ChartComponent = ({ data, type }) => {
  const chartRef = useRef(null);
  let chartInstance = useRef(null);

  useEffect(() => {
    // Destruir instancia previa si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Crear nueva instancia del gráfico
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type,
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });

    // Limpiar al desmontar el componente
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type]);

  return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;
