import { fetchItems, createItem, updateItem, deleteItem } from '../Services/apiService.js';
import Pagination from './Pagination.js';
import GenericForm from './Form.js';

export default {
  name: 'Producto',
  components: {
    Pagination,
    GenericForm
  },
  data() {
    return {
      productos: [],
      paginatedProductos: [],
      nuevoProducto: {
        codigo: '',
        descripcion: '',
        categoria: '',
        precio: 0
      },
      error: null,
      sortColumn: null,
      sortOrder: 'asc',
      itemsPerPage: 5,
      formFields: [
        { name: 'codigo', label: 'Código', type: 'text', required: true },
        { name: 'descripcion', label: 'Descripción', type: 'text', required: true },
        { name: 'categoria', label: 'Categoría', type: 'text', required: true },
        { name: 'precio', label: 'Precio', type: 'number', required: true }
      ]
    };
  },
  methods: {
    fetchProductos() {
      fetchItems('Producto')
        .then(data => {
          this.productos = data.map(producto => ({ ...producto, editando: false }));
          this.paginatedProductos = this.productos.slice(0, this.itemsPerPage);
        })
        .catch(error => {
          console.error('Error al cargar los productos:', error);
          this.error = 'Error al cargar los productos';
        });
    },
    agregarProducto(formData) {
      createItem('Producto', formData)
        .then(() => {
          this.fetchProductos();
        })
        .catch(error => {
          console.error('Error al agregar el producto:', error);
          this.error = 'Error al agregar el producto';
        });
    },
    seleccionarProducto(producto) {
      producto.editando = true;
    },
    actualizarProducto(producto) {
      updateItem('Producto', producto)
        .then(() => {
          producto.editando = false;
          this.fetchProductos();
        })
        .catch(error => {
          console.error('Error al actualizar el producto:', error);
          this.error = 'Error al actualizar el producto';
        });
    },
    cancelarEdicion(producto) {
      producto.editando = false;
      this.fetchProductos();
    },
    eliminarProducto(productoId) {
      deleteItem('Producto', productoId)
        .then(() => {
          this.fetchProductos();
        })
        .catch(error => {
          console.error('Error al eliminar el producto:', error);
          this.error = 'Error al eliminar el producto';
        });
    },
    sortProducts(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortOrder = 'asc';
      }

      this.productos.sort((a, b) => {
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

      // Actualizar los productos paginados después de ordenar
      this.paginatedProductos = this.productos.slice(0, this.itemsPerPage);
    },
    updatePaginatedItems(items) {
      this.paginatedProductos = items;
    }
  },
  mounted() {
    this.fetchProductos();
  },
  template: `
    <div class="producto-container">
      <div v-if="error" class="error">{{ error }}</div>
      <generic-form 
        :fields="formFields" 
        submit-button-text="Agregar Producto" 
        toggle-button-text="Crear Nuevo Producto" 
        @submit="agregarProducto"
      ></generic-form>
      <table class="producto-table">
        <thead>
          <tr>
            <th @click="sortProducts('codigo')">#</th>
            <th @click="sortProducts('descripcion')">Descripción</th>
            <th @click="sortProducts('categoria')">Categoría</th>
            <th @click="sortProducts('precio')">Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in paginatedProductos" :key="producto.productoid">
            <td data-label="Código">
              <span v-if="!producto.editando">{{ producto.codigo }}</span>
              <input v-else v-model="producto.codigo" class="producto-input" />
            </td>
            <td data-label="Descripción">
              <span v-if="!producto.editando">{{ producto.descripcion }}</span>
              <input v-else v-model="producto.descripcion" class="producto-input" />
            </td>
            <td data-label="Categoría">
              <span v-if="!producto.editando">{{ producto.categoria }}</span>
              <input v-else v-model="producto.categoria" class="producto-input" />
            </td>
            <td data-label="Precio">
              <span v-if="!producto.editando">{{ producto.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}</span>
              <input v-else v-model="producto.precio" type="number" class="producto-input" />
            </td>
            <td data-label="Acciones">
              <i v-if="!producto.editando" class="fas fa-edit producto-icon" @click="seleccionarProducto(producto)"></i>
              <i v-else class="fas fa-save producto-icon" @click="actualizarProducto(producto)"></i>
              <i v-if="producto.editando" class="fas fa-times producto-icon" @click="cancelarEdicion(producto)"></i>
              <i class="fas fa-trash producto-icon" @click="eliminarProducto(producto.id)"></i>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination :items="productos" :itemsPerPage="itemsPerPage" @page-changed="updatePaginatedItems" />
    </div>
  `
};