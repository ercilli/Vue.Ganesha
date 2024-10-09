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
      itemsPerPage: 5
    };
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
    agregarDescuento() {
      createItem('DescuentoCantidad', this.nuevoDescuento)
        .then(() => {
          this.fetchDescuentos();
          this.nuevoDescuento = { productoId: '', cantidadMinima: 0, porcentaje: 0, precioDescuento: null };
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
    }
  },
  mounted() {
    this.fetchDescuentos();
  },
  template: `
    <div class="descuento-container">
      <div v-if="error" class="error">{{ error }}</div>
      <form class="descuento-form" @submit.prevent="agregarDescuento">
        <div class="descuento-form-group">
          <label for="productoId">Producto ID:</label>
          <input id="productoId" class="descuento-input" v-model="nuevoDescuento.productoId" placeholder="Producto ID" required />
        </div>
        <div class="descuento-form-group">
          <label for="cantidadMinima">Cantidad Mínima:</label>
          <input id="cantidadMinima" class="descuento-input" v-model="nuevoDescuento.cantidadMinima" type="number" placeholder="Cantidad Mínima" required />
        </div>
        <div class="descuento-form-group">
          <label for="porcentaje">Porcentaje:</label>
          <input id="porcentaje" class="descuento-input" v-model="nuevoDescuento.porcentaje" type="number" placeholder="Porcentaje" required />
        </div>
        <div class="descuento-form-group">
          <label for="precioDescuento">Precio Descuento:</label>
          <input id="precioDescuento" class="descuento-input" v-model="nuevoDescuento.precioDescuento" type="number" placeholder="Precio Descuento" />
        </div>
        <button type="submit" class="descuento-button">Agregar Descuento</button>
      </form>
      <table class="descuento-table">
        <thead>
          <tr>
            <th @click="sortDescuentos('descuentoCantidadId')">ID</th>
            <th @click="sortDescuentos('productoId')">Producto ID</th>
            <th @click="sortDescuentos('cantidadMinima')">Cantidad Mínima</th>
            <th @click="sortDescuentos('porcentaje')">Porcentaje</th>
            <th @click="sortDescuentos('precioDescuento')">Precio Descuento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="descuento in paginatedDescuentos" :key="descuento.descuentoCantidadId">
            <td data-label="ID">
              <span v-if="!descuento.editando">{{ descuento.descuentoCantidadId }}</span>
              <input v-else v-model="descuento.descuentoCantidadId" class="descuento-input" />
            </td>
            <td data-label="Producto ID">
              <span v-if="!descuento.editando">{{ descuento.productoId }}</span>
              <input v-else v-model="descuento.productoId" class="descuento-input" />
            </td>
            <td data-label="Cantidad Mínima">
              <span v-if="!descuento.editando">{{ descuento.cantidadMinima }}</span>
              <input v-else v-model="descuento.cantidadMinima" type="number" class="descuento-input" />
            </td>
            <td data-label="Porcentaje">
              <span v-if="!descuento.editando">{{ descuento.porcentaje }}</span>
              <input v-else v-model="descuento.porcentaje" type="number" class="descuento-input" />
            </td>
            <td data-label="Precio Descuento">
              <span v-if="!descuento.editando">{{ descuento.precioDescuento }}</span>
              <input v-else v-model="descuento.precioDescuento" type="number" class="descuento-input" />
            </td>
            <td data-label="Acciones">
              <button v-if="!descuento.editando" class="descuento-button" @click="seleccionarDescuento(descuento)">Editar</button>
              <button v-else class="descuento-button" @click="actualizarDescuento(descuento)">Guardar</button>
              <button v-if="descuento.editando" class="descuento-button" @click="cancelarEdicion(descuento)">Cancelar</button>
              <button class="descuento-button" @click="eliminarDescuento(descuento.descuentoCantidadId)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination :items="descuentos" :itemsPerPage="itemsPerPage" @page-changed="updatePaginatedItems" />
    </div>
  `
};