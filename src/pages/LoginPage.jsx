import React, { useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';



const LoginPage = () => {
    const [formData, setFormData] = useState({
        correo: '',
        contraseña: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const apiURL = process.env.REACT_APP_API;
    console.log(`Api url: ${apiURL}`);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Petición al backend para iniciar sesión
            const response = await axiosInstance.post(`${apiURL}/api/auth/login`, {
                correo: formData.correo,
                contraseña: formData.contraseña,
            });

            const { token, usuario } = response.data;

            // Guardar token y tipo de usuario en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userType', usuario.tipo); // "cliente" o "proveedor"

            // Redireccionar al perfil correspondiente
            if (usuario.tipo === 'proveedor') {
                navigate('/provider-profile'); // Redirige al perfil del proveedor
            } else if (usuario.tipo === 'cliente') {
                navigate('/client-home'); // Redirige al inicio del cliente
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error.response?.data || error.message);
            setError(error.response?.data?.mensaje || 'Credenciales inválidas.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 relative">
            {/* Botón de regresar */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Regresar
            </button>

            {/* Contenedor del formulario */}
            <div className="w-full max-w-md bg-white shadow-md rounded px-8 py-6">
                <h1 className="text-2xl font-bold text-center mb-6">Chambalancer</h1>
                <div className="flex justify-center mb-6">
                    <img
                        src="/logo.png"
                        alt="Chambalancer Logo"
                        className="w-16 h-16"
                    />
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Correo */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Correo</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Correo electrónico"
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
                        <input
                            type="password"
                            name="contraseña"
                            value={formData.contraseña}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Contraseña"
                        />
                    </div>

                    {/* Mensaje de Error */}
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    {/* Botón de Iniciar Sesión */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                {/* Botones adicionales */}
                <div className="flex flex-col items-center mt-6 space-y-4">
                    {/* Botón de Registrar cuenta */}
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded"
                    >
                        Registrar cuenta
                    </button>

                    {/* Botón de Soy Proveedor */}
                    <button
                        onClick={() => navigate('/register-provider')}
                        className="text-blue-500 hover:underline font-semibold"
                    >
                        Soy proveedor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
