// Importa las funciones desde apiService.js
import { updateProduct, deleteProduct as apiDeleteProduct } from '../Services/apiService.js';

export default {
  props: ['products'],
  data() {
    return {
      sortColumn: null,
      sortOrder: 'asc'
    };
  },
  methods: {
    editProduct(product) {
      product.editing = true;
    },
    saveProduct(product, index) {
      updateProduct(product).then(response => {
        product.editing = false;
        Object.assign(this.products[index], response.data);
      }).catch(error => {
        console.error("Error updating product:", error);
      });
    },
    deleteProduct(index) {
      const productId = this.products[index].productoid;
      apiDeleteProduct(productId).then(() => {
        this.products.splice(index, 1);
      }).catch(error => {
        console.error("Error deleting product:", error);
      });
    },
    sortProducts(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortOrder = 'asc';
      }

      this.products.sort((a, b) => {
        let valA = a[this.sortColumn];
        let valB = b[this.sortColumn];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (this.sortOrder === 'asc') {
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else {
          return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
      });
    }
  },
  template: `
  <table>
    <thead>
      <tr>
        <th @click="sortProducts('codigo')">ID</th>
        <th @click="sortProducts('descripcion')">Descripcion</th>
        <th @click="sortProducts('categoria')">Tipo</th>
        <th @click="sortProducts('precio')">Precio</th>
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
        <td v-if="!product.editing">{{ product.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}</td>
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
}