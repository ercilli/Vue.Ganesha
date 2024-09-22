import { fetchItems, createItem, updateItem, deleteItem } from '../Services/apiService.js';

export default {
  name: 'Proveedor',
  data() {
    return {
      proveedores: [],
      nuevoProveedor: {
        nombre: '',
        direccion: '',
        telefono: ''
      },
      error: null
    };
  },
  methods: {
    fetchProveedores() {
      fetchItems('Proveedor')
        .then(data => {
          this.proveedores = data.map(proveedor => ({ ...proveedor, editando: false }));
        })
        .catch(error => {
          console.error('Error al cargar los proveedores:', error);
          this.error = 'Error al cargar los proveedores';
        });
    },
    agregarProveedor() {
      createItem('Proveedor', this.nuevoProveedor)
        .then(() => {
          this.fetchProveedores();
          this.nuevoProveedor = { nombre: '', direccion: '', telefono: '' };
        })
        .catch(error => {
          console.error('Error al agregar el proveedor:', error);
          this.error = 'Error al agregar el proveedor';
        });
    },
    seleccionarProveedor(proveedor) {
      proveedor.editando = true;
    },
    actualizarProveedor(proveedor) {
      updateItem('Proveedor', proveedor)
        .then(() => {
          proveedor.editando = false;
          this.fetchProveedores();
        })
        .catch(error => {
          console.error('Error al actualizar el proveedor:', error);
          this.error = 'Error al actualizar el proveedor';
        });
    },
    cancelarEdicion(proveedor) {
      proveedor.editando = false;
      this.fetchProveedores();
    },
    eliminarProveedor(proveedorId) {
      deleteItem('Proveedor', proveedorId)
        .then(() => {
          this.fetchProveedores();
        })
        .catch(error => {
          console.error('Error al eliminar el proveedor:', error);
          this.error = 'Error al eliminar el proveedor';
        });
    }
  },
  mounted() {
    this.fetchProveedores();
  },
  template: `
    <div class="proveedor-container">
      <h1 class="proveedor-header">Gestión de Proveedores</h1>
      <div v-if="error" class="error">{{ error }}</div>
      <form class="proveedor-form" @submit.prevent="agregarProveedor">
        <div class="proveedor-form-group">
          <label for="nombre">Nombre:</label>
          <input id="nombre" class="proveedor-input" v-model="nuevoProveedor.nombre" placeholder="Nombre" required />
        </div>
        <div class="proveedor-form-group">
          <label for="direccion">Dirección:</label>
          <input id="direccion" class="proveedor-input" v-model="nuevoProveedor.direccion" placeholder="Dirección" required />
        </div>
        <div class="proveedor-form-group">
          <label for="telefono">Teléfono:</label>
          <input id="telefono" class="proveedor-input" v-model="nuevoProveedor.telefono" placeholder="Teléfono" required />
        </div>
        <button type="submit" class="proveedor-button">Agregar Proveedor</button>
      </form>
      <table class="proveedor-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proveedor in proveedores" :key="proveedor.proveedorid">
            <td data-label="Nombre">
              <span v-if="!proveedor.editando">{{ proveedor.nombre }}</span>
              <input v-else v-model="proveedor.nombre" class="proveedor-input" />
            </td>
            <td data-label="Dirección">
              <span v-if="!proveedor.editando">{{ proveedor.direccion }}</span>
              <input v-else v-model="proveedor.direccion" class="proveedor-input" />
            </td>
            <td data-label="Teléfono">
              <span v-if="!proveedor.editando">{{ proveedor.telefono }}</span>
              <input v-else v-model="proveedor.telefono" class="proveedor-input" />
            </td>
            <td data-label="Acciones">
              <button v-if="!proveedor.editando" class="proveedor-button" @click="seleccionarProveedor(proveedor)">Editar</button>
              <button v-else class="proveedor-button" @click="actualizarProveedor(proveedor)">Guardar</button>
              <button v-if="proveedor.editando" class="proveedor-button" @click="cancelarEdicion(proveedor)">Cancelar</button>
              <button class="proveedor-button" @click="eliminarProveedor(proveedor.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
};