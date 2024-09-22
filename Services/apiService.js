const baseUrl = 'https://vivero-ganesha-api.fly.dev/api';
//const baseUrl = 'https://localhost:7182/api';

// Función genérica para obtener datos
export const fetchItems = (controller) => {
  console.log(`Fetching items from ${controller}`);
  return fetch(`${baseUrl}/${controller}`)
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
};

// Función genérica para obtener un ítem por ID
export const getItemById = (controller, itemId) => {
  console.log(`Fetching item ${itemId} from ${controller}`);
  return fetch(`${baseUrl}/${controller}/${itemId}`)
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
};

// Función genérica para crear un nuevo item
export const createItem = (controller, item) => {
  console.log(`Creating item in ${controller}:`, item);
  return fetch(`${baseUrl}/${controller}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  })
    .then(response => {
      console.log(`Response from creating item in ${controller}:`, response);
      if (response.status === 201) {
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
};

// Función genérica para actualizar un item
export const updateItem = (controller, item) => {
  console.log(`Updating item ${item.id} in ${controller}:`, item);
  return fetch(`${baseUrl}/${controller}/${item.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
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
};

// Función genérica para eliminar un item
export const deleteItem = (controller, itemId) => {
  console.log(`Deleting item ${itemId} from ${controller}`);
  return fetch(`${baseUrl}/${controller}/${itemId}`, {
    method: 'DELETE'
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
};