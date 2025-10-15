import axios from './root.service.js';

export async function getProfile() {
    try {
        const response = await axios.get('/profile/private');
        return response.data.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener perfil' };
        throw error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}
