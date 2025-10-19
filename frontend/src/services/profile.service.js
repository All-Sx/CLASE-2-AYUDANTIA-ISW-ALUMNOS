import axios from './root.service.js';

export async function getProfile() {
    try {
        const response = await axios.get('/profile/private');
        return response.data.data;
    } catch (error) {
        
        throw error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}

export async function updateProfile(userData) {
    try {
        const response = await axios.patch('/profile/private', userData);
        return response.data.data;
    }catch (error) {
        
        throw error.response?.data || { message: 'Error al conectar con el servidor'};
    }
}

export async function deleteProfile() {
    try{
        const response = await axios.delete('/profile/private');
        return response.data.data;
    }catch (error){
        throw error.response?.data || { message: 'Error al conectar con el servidor'};
    }
}
