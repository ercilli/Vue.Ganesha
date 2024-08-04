// Importa las funciones desde apiService.js
import { updateItem, deleteItem } from '../Services/apiService.js';

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
      updateItem('Producto', product).then(response => {
        product.editing = false;
        Object.assign(this.products[index], response || product);
      }).catch(error => {
        console.error("Error updating product:", error);
      });
    },
    deleteProduct(index) {
      const productId = this.products[index].productoid;
      deleteItem('Producto', productId).then(() => {
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
  <div class="data-grid-container">
    <div class="data-grid-header">Product Data Grid</div>
    <table class="data-grid-table">
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
          <td v-else><input v-model="product.descripcion" class="data-grid-input" /></td>
          <td v-if="!product.editing">{{ product.categoria }}</td>
          <td v-else><input v-model="product.categoria" class="data-grid-input" /></td>
          <td v-if="!product.editing">{{ product.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}</td>
          <td v-else><input v-model="product.precio" type="number" class="data-grid-input" /></td>
          <td>
            <button v-if="!product.editing" @click="editProduct(product)" class="data-grid-button">Editar</button>
            <button v-if="product.editing" @click="saveProduct(product, index)" class="data-grid-button">Guardar</button>
            <button @click="deleteProduct(index)" class="data-grid-button">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
}