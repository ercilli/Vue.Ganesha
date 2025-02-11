import { handleError } from '../Components/ErrorHandler.js';

const baseUrl = 'https://localhost:7182/api';
//const baseUrl = 'https://vivero-ganesha-api.fly.dev/api';

let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');
let tokenExpiry = localStorage.getItem('tokenExpiry');

// Función para decodificar el token JWT
const decodeToken = (token) => {
  if (typeof token !== 'string') {
    throw new TypeError('El token debe ser una cadena');
  }
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
      accessToken = data.accessToken;
      refreshToken = data.refreshToken;
      tokenExpiry = new Date().getTime() + data.expiresIn * 1000; // Convertir a milisegundos
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
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
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${baseUrl}/login/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (response.status === 201 || response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error al registrar el usuario');
    }
  } catch (error) {
    handleError(error, 'registrar usuario');
    throw error;
  }
};

// Función para refrescar el token
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${baseUrl}/login/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (response.status === 200) {
      const data = await response.json();
      accessToken = data.accessToken;
      refreshToken = data.refreshToken;
      tokenExpiry = new Date().getTime() + data.expiresIn * 1000; // Convertir a milisegundos
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('tokenExpiry', tokenExpiry);
      return accessToken;
    } else {
      throw new Error('Error al refrescar el token');
    }
  } catch (error) {
    handleError(error, 'refrescar token');
    throw error;
  }
};

// Función para obtener el token actual
export const getAccessToken = async () => {
  try {
    if (new Date().getTime() > tokenExpiry) {
      // Token ha expirado, intentar refrescarlo
      return await refreshAccessToken();
    }
    if (!accessToken) {
      throw new Error('No hay un token de acceso disponible');
    }
    return accessToken;
  } catch (error) {
    handleError(error, 'obtener token');
    throw error;
  }
};

// Función para obtener el rol del usuario
export const getUserRole = async () => {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de acceso');
    }
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
  refreshToken = null;
  tokenExpiry = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiry');
};