import { fetchItems, createItem, updateItem, deleteItem } from '../Services/apiService.js';

export default {
  name: 'Producto',
  data() {
    return {
      productos: [],
      nuevoProducto: {
        descripcion: '',
        categoria: '',
        precio: 0
      },
      error: null,
      sortColumn: null,
      sortOrder: 'asc'
    };
  },
  methods: {
    fetchProductos() {
      fetchItems('Producto')
        .then(data => {
          this.productos = data.map(producto => ({ ...producto, editando: false }));
        })
        .catch(error => {
          console.error('Error al cargar los productos:', error);
          this.error = 'Error al cargar los productos';
        });
    },
    agregarProducto() {
      createItem('Producto', this.nuevoProducto)
        .then(() => {
          this.fetchProductos();
          this.nuevoProducto = { descripcion: '', categoria: '', precio: 0 };
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
    }
  },
  mounted() {
    this.fetchProductos();
  },
  template: `
    <div class="producto-container">
      <h1 class="producto-header">Gestión de Productos</h1>
      <div v-if="error" class="error">{{ error }}</div>
      <form class="producto-form" @submit.prevent="agregarProducto">
        <div class="producto-form-group">
          <label for="descripcion">Descripción:</label>
          <input id="descripcion" class="producto-input" v-model="nuevoProducto.descripcion" placeholder="Descripción" required />
        </div>
        <div class="producto-form-group">
          <label for="categoria">Categoría:</label>
          <input id="categoria" class="producto-input" v-model="nuevoProducto.categoria" placeholder="Categoría" required />
        </div>
        <div class="producto-form-group">
          <label for="precio">Precio:</label>
          <input id="precio" class="producto-input" v-model="nuevoProducto.precio" type="number" placeholder="Precio" required />
        </div>
        <button type="submit" class="producto-button">Agregar Producto</button>
      </form>
      <table class="producto-table">
        <thead>
          <tr>
            <th @click="sortProducts('codigo')">Código</th>
            <th @click="sortProducts('descripcion')">Descripción</th>
            <th @click="sortProducts('categoria')">Categoría</th>
            <th @click="sortProducts('precio')">Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.productoid">
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
              <button v-if="!producto.editando" class="producto-button" @click="seleccionarProducto(producto)">Editar</button>
              <button v-else class="producto-button" @click="actualizarProducto(producto)">Guardar</button>
              <button v-if="producto.editando" class="producto-button" @click="cancelarEdicion(producto)">Cancelar</button>
              <button class="producto-button" @click="eliminarProducto(producto.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
};