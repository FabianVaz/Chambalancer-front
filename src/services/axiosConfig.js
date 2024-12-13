import axios from 'axios';

// Crear una instancia de Axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // Cambia la URL base según tu configuración
});

// Interceptor para agregar el token automáticamente
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
