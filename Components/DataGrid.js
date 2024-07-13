// Importa las funciones desde apiService.js
import { updateProduct, deleteProduct as apiDeleteProduct } from '../Services/apiService.js';

export default {
  props: ['products'],
  template: `
  <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripcion</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product.productoid">
              <td>{{ product.codigo }}</td>
              <td v-if="!product.editing">{{ product.descripcion }}</td>
              <td v-else><input v-model="product.descripcion" /></td>
              <td v-if="!product.editing">{{ product.categoria }}</td>
              <td v-else><input v-model="product.categoria" /></td>
              <td v-if="!product.editing">{{ product.precio }}</td>
              <td v-else><input v-model="product.precio" type="number" /></td>
              <td>
                <button v-if="!product.editing" @click="editProduct(product)">Editar</button>
                <button v-if="product.editing" @click="saveProduct(product, index)">Guardar</button>
                <button @click="deleteProduct(index)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
  `,
   methods: {
          editProduct(product) {
            product.editing = true;
          },
          saveProduct(product, index) {
            // Usa updateProduct de apiService.js
            updateProduct(product)
              .then(data => {
                if (data !== null && Object.keys(data).length !== 0) {
                  // Solo actualiza el producto en la lista si data no es null y no está vacío
                  this.products[index] = data;
                }
                // Desactiva el modo de edición independientemente de la respuesta
                product.editing = false;
              })
              .catch(error => console.error('Error al guardar el producto:', error));
          },
          deleteProduct(index) {
            const product = this.products[index];
            // Usa deleteProduct de apiService.js
            apiDeleteProduct(product.productid)
              .then(() => {
                this.products.splice(index, 1); // Elimina el producto de la lista
              })
              .catch(error => console.error('Error al eliminar el producto:', error));
          }
        }
}