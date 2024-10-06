import { getAccessToken } from './authService.js';

//const baseUrl = 'https://localhost:7182/api';
const baseUrl = 'https://vivero-ganesha-api.fly.dev/api';

// Función genérica para obtener datos
export const fetchItems = (controller) => {
  try {
    const token = getAccessToken();
    console.log(`Fetching items from ${controller}`);
    return fetch(`${baseUrl}/${controller}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        console.log(`Response from ${controller}:`, response);
        return response.json();
      })
      .then(data => {
        console.log(`Data from ${controller}:`, data);
        return data;
      })
      .catch(error => {
        console.error(`Error fetching items from ${controller}:`, error);
        throw error;
      });
  } catch (error) {
    console.error('Error fetching items:', error);
    // Redirigir al usuario a la página de inicio de sesión si el token ha expirado
    window.location.href = '/index.html';
  }
};

// Función genérica para obtener un ítem por ID
export const getItemById = (controller, itemId) => {
  try {
    const token = getAccessToken();
    console.log(`Fetching item ${itemId} from ${controller}`);
    return fetch(`${baseUrl}/${controller}/${itemId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        console.log(`Response from ${controller}/${itemId}:`, response);
        return response.json();
      })
      .then(data => {
        console.log(`Data from ${controller}/${itemId}:`, data);
        return data;
      })
      .catch(error => {
        console.error(`Error fetching item ${itemId} from ${controller}:`, error);
        throw error;
      });
  } catch (error) {
    console.error('Error fetching item:', error);
    // Redirigir al usuario a la página de inicio de sesión si el token ha expirado
    window.location.href = '/index.html';
  }
};

// Función genérica para crear un nuevo item
export const createItem = (controller, item) => {
  try {
    const token = getAccessToken();
    console.log(`Creating item in ${controller}:`, item);
    return fetch(`${baseUrl}/${controller}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(item)
    })
      .then(response => {
        console.log(`Response from creating item in ${controller}:`, response);
        if (response.status === 201 || response.status === 200) {
          return response.json();
        } else {
          throw new Error('Error al crear el item');
        }
      })
      .then(data => {
        console.log(`Data from creating item in ${controller}:`, data);
        return data;
      })
      .catch(error => {
        console.error(`Error creating item in ${controller}:`, error);
        throw error;
      });
  } catch (error) {
    console.error('Error creating item:', error);
    // Redirigir al usuario a la página de inicio de sesión si el token ha expirado
    window.location.href = '/index.html';
  }
};

// Función genérica para actualizar un item
export const updateItem = (controller, item) => {
  try {
    const token = getAccessToken();
    console.log(`Updating item ${item.id} in ${controller}:`, item);
    return fetch(`${baseUrl}/${controller}/${item.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(item)
    })
      .then(response => {
        console.log(`Response from updating item ${item.id} in ${controller}:`, response);
        if (response.status === 204) {
          return null;
        } else {
          return response.json();
        }
      })
      .then(data => {
        console.log(`Data from updating item ${item.id} in ${controller}:`, data);
        return data;
      })
      .catch(error => {
        console.error(`Error updating item ${item.id} in ${controller}:`, error);
        throw error;
      });
  } catch (error) {
    console.error('Error updating item:', error);
    // Redirigir al usuario a la página de inicio de sesión si el token ha expirado
    window.location.href = '/index.html';
  }
};

// Función genérica para eliminar un item
export const deleteItem = (controller, itemId) => {
  try {
    const token = getAccessToken();
    console.log(`Deleting item ${itemId} from ${controller}`);
    return fetch(`${baseUrl}/${controller}/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        console.log(`Response from deleting item ${itemId} from ${controller}:`, response);
        if (!response.ok) {
          throw new Error('Error al eliminar el item');
        }
      })
      .catch(error => {
        console.error(`Error deleting item ${itemId} from ${controller}:`, error);
        throw error;
      });
  } catch (error) {
    console.error('Error deleting item:', error);
    // Redirigir al usuario a la página de inicio de sesión si el token ha expirado
    window.location.href = '/index.html';
  }
};