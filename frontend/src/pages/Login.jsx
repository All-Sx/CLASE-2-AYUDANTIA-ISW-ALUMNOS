import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/auth.service';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await login({ email, password });

            if (response?.data?.token) {
            localStorage.setItem('token', response.data.token);
            navigate('/home');
            } else {
            alert('Credenciales inválidas. Por favor, inténtalo de nuevo.');
            } 
            }catch (error) {
                console.error('Error during login:', error);

                if (error.response && error.response.status === 400){
                    alert('Credenciales inválidas. Por favor, inténtalo de nuevo.');
                }else if(error.response && error.response.status === 401){
                    alert('Usuario no autorizado. Por favor, verifica tus credenciales.');
                }else{
                    alert('Error del servidor. Por favor, inténtalo más tarde.');
                }
        }
    };    
    
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await register({email, password});

            if (response?.data) {
                alert('Registro exitoso.');
                //Inicio de sesion automatico
                const loginResponse = await login({ email, password });
                if (loginResponse?.data?.token) {
                    localStorage.setItem('token', loginResponse.data.token);
                    navigate('/home');
                }
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            if (error.response?.status === 400) {
                alert('El usuario ya existe o los datos no son validos.');
            } else {
                alert('Error del servidor. Por favor, inténtalo más tarde.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md transform transition-all hover:scale-105">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-8">
                        Iniciar sesión
                    </h1>
                    
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@ejemplo.com"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="**********"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                        />
                    </div>
                    <div className="flex flex-row space-x-4">
                        <button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
                        >
                            Iniciar sesión
                        </button>
                        <button
                            type="button"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
                            onClick={handleRegister}
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;