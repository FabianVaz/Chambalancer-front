import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  // Registrar elementos y escalas necesarios
  ChartJS.register(
    ArcElement, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    PointElement, 
    LineElement, 
    Tooltip, 
    Legend
  );
  