import { fetchItems, createItem, updateItem, deleteItem } from '../Services/apiService.js';

export default {
  name: 'Cliente',
  data() {
    return {
      clientes: [],
      nuevoCliente: {
        nombre: '',
        direccion: '',
        telefono: '',
        email: '' // Agregar campo de email
      },
      error: null
    };
  },
  methods: {
    fetchClientes() {
      fetchItems('Cliente')
        .then(data => {
          this.clientes = data.map(cliente => ({ ...cliente, editando: false }));
        })
        .catch(error => {
          console.error('Error al cargar los clientes:', error);
          this.error = 'Error al cargar los clientes';
        });
    },
    agregarCliente() {
      createItem('Cliente', this.nuevoCliente)
        .then(() => {
          this.fetchClientes();
          this.nuevoCliente = { nombre: '', direccion: '', telefono: '', email: '' }; // Resetear campo de email
        })
        .catch(error => {
          console.error('Error al agregar el cliente:', error);
          this.error = 'Error al agregar el cliente';
        });
    },
    seleccionarCliente(cliente) {
      cliente.editando = true;
    },
    actualizarCliente(cliente) {
      updateItem('Cliente', cliente)
        .then(() => {
          cliente.editando = false;
          this.fetchClientes();
        })
        .catch(error => {
          console.error('Error al actualizar el cliente:', error);
          this.error = 'Error al actualizar el cliente';
        });
    },
    cancelarEdicion(cliente) {
      cliente.editando = false;
      this.fetchClientes();
    },
    eliminarCliente(clienteId) {
      deleteItem('Cliente', clienteId)
        .then(() => {
          this.fetchClientes();
        })
        .catch(error => {
          console.error('Error al eliminar el cliente:', error);
          this.error = 'Error al eliminar el cliente';
        });
    }
  },
  mounted() {
    this.fetchClientes();
  },
  template: `
    <div class="cliente-container">
      <div v-if="error" class="cliente-error">{{ error }}</div>
      <form class="cliente-form" @submit.prevent="agregarCliente">
        <div class="cliente-form-group">
          <label for="nombre">Nombre:</label>
          <input id="nombre" class="cliente-input" v-model="nuevoCliente.nombre" placeholder="Nombre" required />
        </div>
        <div class="cliente-form-group">
          <label for="direccion">Dirección:</label>
          <input id="direccion" class="cliente-input" v-model="nuevoCliente.direccion" placeholder="Dirección" required />
        </div>
        <div class="cliente-form-group">
          <label for="telefono">Teléfono:</label>
          <input id="telefono" class="cliente-input" v-model="nuevoCliente.telefono" placeholder="Teléfono" required />
        </div>
        <div class="cliente-form-group">
          <label for="email">Email:</label>
          <input id="email" class="cliente-input" v-model="nuevoCliente.email" placeholder="Email" required />
        </div>
        <button type="submit" class="cliente-button">Agregar Cliente</button>
      </form>
      <table class="cliente-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in clientes" :key="cliente.clienteid">
            <td data-label="Nombre">
              <span v-if="!cliente.editando">{{ cliente.nombre }}</span>
              <input v-else v-model="cliente.nombre" class="cliente-input" />
            </td>
            <td data-label="Dirección">
              <span v-if="!cliente.editando">{{ cliente.direccion }}</span>
              <input v-else v-model="cliente.direccion" class="cliente-input" />
            </td>
            <td data-label="Teléfono">
              <span v-if="!cliente.editando">{{ cliente.telefono }}</span>
              <input v-else v-model="cliente.telefono" class="cliente-input" />
            </td>
            <td data-label="Email">
              <span v-if="!cliente.editando">{{ cliente.email }}</span>
              <input v-else v-model="cliente.email" class="cliente-input" />
            </td>
            <td data-label="Acciones">
              <i v-if="!cliente.editando" class="fas fa-edit cliente-icon" @click="seleccionarCliente(cliente)"></i>
              <i v-else class="fas fa-save cliente-icon" @click="actualizarCliente(cliente)"></i>
              <i v-if="cliente.editando" class="fas fa-times cliente-icon" @click="cancelarEdicion(cliente)"></i>
              <i class="fas fa-trash cliente-icon" @click="eliminarCliente(cliente.id)"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
};