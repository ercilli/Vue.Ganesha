const isProduction = window.location.hostname.includes('github.io');
const redirectBaseUrl = isProduction ? '/Vue.Ganesha/' : './index.html';

export const handleError = (error, action) => {
  console.error(`Error ${action}:`, error);
  // Redirigir al usuario a la página de inicio de sesión si el token ha expirado
  if (error.message.includes('Token ha expirado')) {
    window.location.href = redirectBaseUrl;
  }
};