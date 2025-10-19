import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, deleteProfile } from '../services/profile.service';

const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({ email: '', password: '' });
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleShowUpdateForm = async () => {
    if (!profileData) {
      try {
        const data = await getProfile();
        setProfileData(data.userData);
        setUpdateData({
          email: data.userData.email,
          password: ''
        });
      } catch (error) {
        alert('Error al obtener el perfil');
        return;
      }
    } else {
      setUpdateData({
        email: profileData.email,
        password: ''
      });
    }
    setShowUpdateForm(!showUpdateForm);
  };

  const handleGetProfile = async () => {
    try {
      if(!profileData){
        const data = await getProfile();
        setProfileData(data.userData);  
      }
      setShowProfile(!showProfile);
    } catch (error) {
      alert(error.message || 'Error al obtener el perfil');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const data = await updateProfile(updateData);
      setProfileData(data.userData);
      setShowUpdateForm(false);
      alert('Perfil actualizado con éxito');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      alert(error.message || 'Error al actualizar el perfil');
    }
  };

  const handleDeleteProfile = async () => {
    const isConfirmed = window.confirm('¿Estás seguro de que quieres eliminar tu perfil? Esta acción es irreversible.');
    if (isConfirmed){
      try {
        await deleteProfile();
        alert('Perfil eliminado con éxito');
        localStorage.removeItem('token');
        navigate('/');
      }catch (error) {
        alert(error.message || 'Ocurrió un error al eliminar el perfil.');
      }
    } 
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl transform transition-all hover:scale-105">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          Página de Inicio.
        </h1>
        
      <div className="flex flex-row space-x-4">
        <button 
          onClick={handleGetProfile} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Obtener Perfil.
        </button>

        <button
          onClick={handleShowUpdateForm}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Actualizar Perfil.
        </button>

        <button
          onClick={handleDeleteProfile}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Eliminar Perfil.
        </button>
      </div>

        {showUpdateForm && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border-2 border-gray-800 shadow-lg">
            <h2 className='text-xl font-bold mb-4 text-gray-800'>Actualizar Perfil:</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type ="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={updateData.email}
                  onChange={(e) => setUpdateData({...updateData, email: e.target.value})}
                  placeholder={profileData?.email || "Email"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={updateData.password}
                  onChange={(e) => setUpdateData({...updateData, password: e.target.value})}
                  placeholder="Nueva contraseña"
                />
              </div>
              <button
                onClick={handleUpdateProfile}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                Guardar Cambios
                </button>
            </div>
          </div>
        )}

        {profileData && !showUpdateForm && showProfile && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border-2 border-gray-800 shadow-lg">
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