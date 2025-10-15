import { useState } from 'react';
import { getProfile } from '../services/profile.service';

const Home = () => {
  const [profileData, setProfileData] = useState(null);

  const handleGetProfile = async () => {
    try {
      const data = await getProfile();
      setProfileData(data.userData);  
    } catch (error) {
      alert(error.message || 'Error al obtener el perfil');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl transform transition-all hover:scale-105">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          Página de Inicio
        </h1>
        
        <button 
          onClick={handleGetProfile} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Obtener Perfil
        </button>

        {profileData && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className='text-xl font-bold mb-2 text-gray-800'>Datos del usuario:</h2>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Contraseña:</strong> {profileData.password}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
