import React, { useState } from 'react';
import axiosInstance from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';

const PublishServicePage = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripción: '',
        categoría: '',
        precio: '',
        ubicacion: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validar campos vacíos
        const { nombre, descripción, categoría, precio, ubicacion } = formData;
        if (!nombre || !descripción || !categoría || !precio || !ubicacion) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axiosInstance.post('http://localhost:5000/api/services', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Asegúrate de tener un token válido
                },
            });

            setSuccess('Servicio publicado exitosamente.');
            setTimeout(() => navigate('/provider-profile'), 1500); // Redirige al perfil después de publicar
        } catch (error) {
            console.error('Error al publicar el servicio:', error.response?.data || error.message);
            setError(error.response?.data?.mensaje || 'Hubo un error al publicar el servicio. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-6">Publicar Servicio</h1>
            <form onSubmit={handleSubmit}>
                {/* Nombre del servicio */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Nombre del Servicio</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                        placeholder="Nombre del servicio"
                    />
                </div>

                {/* Descripción */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Descripción</label>
                    <textarea
                        name="descripción"
                        value={formData.descripción}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                        rows="4"
                        placeholder="Descripción del servicio"
                    />
                </div>

                {/* Categoría */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Categoría</label>
                    <select
                        name="categoría"
                        value={formData.categoría}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    >
                        <option value="">Selecciona una categoría</option>
                        <option value="carpintería">Carpintería</option>
                        <option value="fontanería">Fontanería</option>
                        <option value="reparación de electrodomésticos">Reparación de Electrodomésticos</option>
                        <option value="construcción">Construcción</option>
                    </select>
                </div>

                {/* Precio */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Precio</label>
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                        placeholder="Precio del servicio"
                    />
                </div>

                {/* Ubicación */}
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Ubicación</label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                        placeholder="Dirección del servicio"
                    />
                </div>

                {/* Mensajes de error y éxito */}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}

                {/* Botón Publicar */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
                >
                    Publicar
                </button>
            </form>
        </div>
    );
};

export default PublishServicePage;

