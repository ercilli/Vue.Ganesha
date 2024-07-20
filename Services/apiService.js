const baseUrl = 'https://vivero-ganesha-api.fly.dev/api';
//const baseUrl = 'https://localhost:7182/api';

// Función genérica para obtener datos
export const fetchItems = (controller) => {
  return fetch(`${baseUrl}/${controller}`).then(response => response.json());
};

// Función genérica para obtener un ítem por ID
export const getItemById = (controller, itemId) => {
  return fetch(`${baseUrl}/${controller}/${itemId}`).then(response => response.json());
};

// Función genérica para crear un nuevo item
export const createItem = (controller, item) => {
  return fetch(`${baseUrl}/${controller}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  }).then(response => response.json());
};

// Función genérica para actualizar un item
export const updateItem = (controller, item) => {
  return fetch(`${baseUrl}/${controller}/${item.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  }).then(response => {
    if (response.status === 204) {
      return null;
    } else {
      return response.json();
    }
  });
};

// Función genérica para eliminar un item
export const deleteItem = (controller, itemId) => {
  return fetch(`${baseUrl}/${controller}/${itemId}`, {
    method: 'DELETE'
  });
};
