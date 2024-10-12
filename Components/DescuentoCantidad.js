import { fetchItems, createItem, updateItem, deleteItem } from '../Services/apiService.js';
import Pagination from './Pagination.js';
import SearchBar from './SearchBar.js';

export default {
  name: 'DescuentoCantidad',
  components: {
    Pagination,
    SearchBar
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
    },
    handleFilteredProductos(filteredProductos) {
      this.productosFiltrados = filteredProductos;
    }
  },
  mounted() {
    this.fetchDescuentos();
    this.fetchProductos(); // Asegurarse de que los productos se carguen al montar el componente
  },
  template: `
    <div class="descuento-container">
      <div v-if="error" class="error">{{ error }}</div>
      <search-bar 
        :items="productos" 
        searchKey="descripcion" 
        placeholder="Buscar producto..." 
        @filtered="handleFilteredProductos"
        @agregar-descuento="agregarDescuentoDesdeProducto"
      />
      <table class="descuento-table">
        <thead>
          <tr>
            <!-- Ocultar la columna "Id" -->
            <!-- <th @click="sortDescuentos('descuentoCantidadId')">Id</th> -->
            <th @click="sortDescuentos('productoId')">Descripción</th>
            <th @click="sortDescuentos('cantidadMinima')">Unidad</th>
            <th @click="sortDescuentos('porcentaje')">%</th>
            <th @click="sortDescuentos('precioDescuento')">$</th>
            <th>#</th>
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
              <button v-if="!descuento.editando" class="descuento-button editar" @click="seleccionarDescuento(descuento)"><i class="fas fa-edit"></i></button>
              <button v-else class="descuento-button" @click="actualizarDescuento(descuento)">Guardar</button>
              <button v-if="descuento.editando" class="descuento-button" @click="cancelarEdicion(descuento)">Cancelar</button>
              <button class="descuento-button eliminar" @click="eliminarDescuento(descuento.id)"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination :items="descuentos" :itemsPerPage="itemsPerPage" @page-changed="updatePaginatedItems" />
    </div>
  `
};