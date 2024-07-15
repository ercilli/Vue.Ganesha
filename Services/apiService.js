const baseUrl = 'https://localhost:7182/api/Producto';
//const baseUrl = 'https://vivero-ganesha-api.fly.dev/api/Producto';


export const fetchProducts = () => {
  return fetch(baseUrl).then(response => response.json());
};

export const updateProduct = (product) => {
  return fetch(`${baseUrl}/${product.productoid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  }).then(response => {
    if (response.status === 204) {
      // No hay contenido para devolver, operación exitosa
      return null; // O puedes devolver un objeto vacío {} según lo que necesites
    } else {
      // Si el servidor devuelve algo diferente a 204, asumimos que hay un cuerpo de respuesta
      return response.json();
    }
  });
};

export const deleteProduct = (productid) => {
  return fetch(`${baseUrl}/${productid}`, {
	method: 'DELETE'
  });
};