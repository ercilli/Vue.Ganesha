import { fetchItems, createItem, updateItem, deleteItem } from '../Services/apiService.js';
import Pagination from './Pagination.js';

export default {
  name: 'DescuentoCantidad',
  components: {
    Pagination
  },
  data() {
    return {
      descuentos: [],
      paginatedDescuentos: [],
      nuevoDescuento: {
        productoId: '',
        cantidadMinima: 0,
        porcentaje: 0,
        precioDescuento: null
      },
      error: null,
      sortColumn: null,
      sortOrder: 'asc',
      itemsPerPage: 5,
      searchQuery: '', // Nuevo campo de búsqueda
      productos: [], // Lista de productos
      productosFiltrados: [] // Lista de productos filtrados
    };
  },
  created() {
    this.fetchDescuentos();
    this.fetchProductos(); // Cargar productos al crear el componente
  },
  methods: {
    fetchDescuentos() {
      fetchItems('DescuentoCantidad')
        .then(data => {
          this.descuentos = data.map(descuento => ({ ...descuento, editando: false }));
          this.paginatedDescuentos = this.descuentos.slice(0, this.itemsPerPage);
        })
        .catch(error => {
          console.error('Error al cargar los descuentos:', error);
          this.error = 'Error al cargar los descuentos';
        });
    },
    fetchProductos() {
      fetchItems('Producto')
        .then(data => {
          this.productos = data.map(producto => ({
            ...producto,
            cantidadMinima: 0,
            porcentaje: 0,
            precioDescuento: 0 // Inicializar en 0
          }));
        })
        .catch(error => {
          console.error('Error al cargar los productos:', error);
          this.error = 'Error al cargar los productos';
        });
    },
    buscarProducto() {
      const query = this.searchQuery.toLowerCase();
      if (query === '') {
        this.productosFiltrados = [];
      } else {
        this.productosFiltrados = this.productos.filter(producto => {
          return producto.descripcion.toLowerCase().includes(query);
        });
      }
    },
    handlePorcentajeInput(producto) {
      if (producto.porcentaje !== 0) {
        producto.precioDescuento = 0;
      }
    },
    handlePrecioDescuentoInput(producto) {
      if (producto.precioDescuento !== 0) {
        producto.porcentaje = 0;
      }
    },
    agregarDescuentoDesdeProducto(producto) {
      this.nuevoDescuento = {
        productoId: producto.id,
        cantidadMinima: producto.cantidadMinima,
        porcentaje: producto.porcentaje,
        precioDescuento: producto.precioDescuento
      };
      this.agregarDescuento();
    },
    agregarDescuento() {
      createItem('DescuentoCantidad', this.nuevoDescuento)
        .then(() => {
          this.fetchDescuentos();
          this.nuevoDescuento = { productoId: '', cantidadMinima: 0, porcentaje: 0, precioDescuento: 0 };
        })
        .catch(error => {
          console.error('Error al agregar el descuento:', error);
          this.error = 'Error al agregar el descuento';
        });
    },
    seleccionarDescuento(descuento) {
      descuento.editando = true;
    },
    actualizarDescuento(descuento) {
      updateItem('DescuentoCantidad', descuento)
        .then(() => {
          descuento.editando = false;
          this.fetchDescuentos();
        })
        .catch(error => {
          console.error('Error al actualizar el descuento:', error);
          this.error = 'Error al actualizar el descuento';
        });
    },
    cancelarEdicion(descuento) {
      descuento.editando = false;
      this.fetchDescuentos();
    },
    eliminarDescuento(descuentoId) {
      deleteItem('DescuentoCantidad', descuentoId)
        .then(() => {
          this.fetchDescuentos();
        })
        .catch(error => {
          console.error('Error al eliminar el descuento:', error);
          this.error = 'Error al eliminar el descuento';
        });
    },
    sortDescuentos(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortOrder = 'asc';
      }

      this.descuentos.sort((a, b) => {
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

      // Actualizar los descuentos paginados después de ordenar
      this.paginatedDescuentos = this.descuentos.slice(0, this.itemsPerPage);
    },
    updatePaginatedItems(items) {
      this.paginatedDescuentos = items;
    },
    obtenerDescripcionProducto(productoId) {
      const producto = this.productos.find(p => p.id === productoId);
      return producto ? producto.descripcion : '';
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
    },
    formatPercentage(value) {
      return `${value}%`;
    }
  },
  mounted() {
    this.fetchDescuentos();
    this.fetchProductos(); // Asegurarse de que los productos se carguen al montar el componente
  },
  template: `
    <div class="descuento-container">
      <div v-if="error" class="error">{{ error }}</div>
      <div class="search-container">
        <input id="search" class="descuento-input" v-model="searchQuery" @input="buscarProducto" placeholder="Buscar" />
        <span class="search-icon">🔍</span>
      </div>
      <div v-if="productosFiltrados.length > 0">
        <table class="coincidencias-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Descripción</th>
              <th>Unidad</th>
              <th>%</th>
              <th>$</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productosFiltrados" :key="producto.id">
              <td>{{ producto.id }}</td>
              <td>{{ producto.descripcion }}</td>
              <td><input v-model="producto.cantidadMinima" type="number" class="descuento-input" /></td>
              <td><input v-model="producto.porcentaje" type="number" class="descuento-input" @input="handlePorcentajeInput(producto)" /></td>
              <td><input v-model="producto.precioDescuento" type="number" class="descuento-input" :disabled="producto.porcentaje !== 0" @input="handlePrecioDescuentoInput(producto)" /></td>
              <td><button class="descuento-button" @click="agregarDescuentoDesdeProducto(producto)">Agregar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <table class="descuento-table">
        <thead>
          <tr>
            <!-- Ocultar la columna "Id" -->
            <!-- <th @click="sortDescuentos('descuentoCantidadId')">Id</th> -->
            <th @click="sortDescuentos('productoId')">Descripción</th>
            <th @click="sortDescuentos('cantidadMinima')">Unidad</th>
            <th @click="sortDescuentos('porcentaje')">%</th>
            <th @click="sortDescuentos('precioDescuento')">$</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="descuento in paginatedDescuentos" :key="descuento.descuentoCantidadId">
            <!-- Ocultar la columna "Id" -->
            <!-- <td data-label="ID">
              <span v-if="!descuento.editando">{{ descuento.descuentoCantidadId }}</span>
              <input v-else v-model="descuento.descuentoCantidadId" class="descuento-input" />
            </td> -->
            <td data-label="Descripción">
              <span v-if="!descuento.editando">{{ obtenerDescripcionProducto(descuento.productoId) }}</span>
              <input v-else v-model="descuento.productoId" class="descuento-input" />
            </td>
            <td data-label="Cantidad Mínima">
              <span v-if="!descuento.editando">{{ descuento.cantidadMinima }}</span>
              <input v-else v-model="descuento.cantidadMinima" type="number" class="descuento-input" />
            </td>
            <td data-label="Porcentaje">
              <span v-if="!descuento.editando">{{ formatPercentage(descuento.porcentaje) }}</span>
              <input v-else v-model="descuento.porcentaje" type="number" class="descuento-input" />
            </td>
            <td data-label="Precio Descuento">
              <span v-if="!descuento.editando">{{ formatCurrency(descuento.precioDescuento) }}</span>
              <input v-else v-model="descuento.precioDescuento" type="number" class="descuento-input" />
            </td>
            <td data-label="Acciones">
              <button v-if="!descuento.editando" class="descuento-button" @click="seleccionarDescuento(descuento)">Editar</button>
              <button v-else class="descuento-button" @click="actualizarDescuento(descuento)">Guardar</button>
              <button v-if="descuento.editando" class="descuento-button" @click="cancelarEdicion(descuento)">Cancelar</button>
              <button class="descuento-button" @click="eliminarDescuento(descuento.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination :items="descuentos" :itemsPerPage="itemsPerPage" @page-changed="updatePaginatedItems" />
    </div>
  `
};