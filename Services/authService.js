import { handleError } from '../Components/ErrorHandler.js';

//const baseUrl = 'https://localhost:7182/api';
const baseUrl = 'https://vivero-ganesha-api.fly.dev/api';

let accessToken = localStorage.getItem('accessToken');
let tokenExpiry = localStorage.getItem('tokenExpiry');

// Función para decodificar el token JWT
const decodeToken = (token) => {
  const payload = token.split('.')[1];
  const decodedPayload = atob(payload);
  return JSON.parse(decodedPayload);
};

// Función para iniciar sesión
export const loginUser = async (credentials) => {
  try {
    console.log(' user:', credentials);
    const response = await fetch(`${baseUrl}/login/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (response.status === 200) {
      const data = await response.json();
      accessToken = data.token;
      const decodedToken = decodeToken(accessToken);
      tokenExpiry = decodedToken.exp * 1000; // Convertir a milisegundos
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('tokenExpiry', tokenExpiry);
      return data;
    } else {
      throw new Error('Error al iniciar sesión');
    }
  } catch (error) {
    handleError(error, 'iniciar sesión');
    throw error;
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (userDetails) => {
  try {
    console.log('Registering user:', userDetails);
    const response = await fetch(`${baseUrl}/login/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails)
    });

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error al registrar usuario');
    }
  } catch (error) {
    handleError(error, 'registrar usuario');
    throw error;
  }
};

// Función para obtener el token actual
export const getAccessToken = () => {
  try {
    if (new Date().getTime() > tokenExpiry) {
      // Token ha expirado
      logoutUser();
      throw new Error('Token ha expirado. Por favor, inicie sesión de nuevo.');
    }
    return accessToken;
  } catch (error) {
    handleError(error, 'obtener token');
    throw error;
  }
};

// Función para obtener el rol del usuario
export const getUserRole = () => {
  try {
    const token = getAccessToken();
    if (!token) return null;

    const decodedToken = decodeToken(token);
    return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; // Usar el URI correcto para obtener el rol
  } catch (error) {
    handleError(error, 'obtener rol del usuario');
    throw error;
  }
};

// Función para cerrar sesión
export const logoutUser = () => {
  accessToken = null;
  tokenExpiry = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('tokenExpiry');
};