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
    <div class="venta-container">
      <h1 class="venta-header">Gestión de Clientes</h1>
      <div v-if="error" class="error">{{ error }}</div>
      <form class="venta-form" @submit.prevent="agregarCliente">
        <div class="venta-form-group">
          <label for="nombre">Nombre:</label>
          <input id="nombre" class="venta-input" v-model="nuevoCliente.nombre" placeholder="Nombre" required />
        </div>
        <div class="venta-form-group">
          <label for="direccion">Dirección:</label>
          <input id="direccion" class="venta-input" v-model="nuevoCliente.direccion" placeholder="Dirección" required />
        </div>
        <div class="venta-form-group">
          <label for="telefono">Teléfono:</label>
          <input id="telefono" class="venta-input" v-model="nuevoCliente.telefono" placeholder="Teléfono" required />
        </div>
        <div class="venta-form-group">
          <label for="email">Email:</label>
          <input id="email" class="venta-input" v-model="nuevoCliente.email" placeholder="Email" required />
        </div>
        <button type="submit" class="venta-button">Agregar Cliente</button>
      </form>
      <table class="venta-table">
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
              <input v-else v-model="cliente.nombre" class="venta-input" />
            </td>
            <td data-label="Dirección">
              <span v-if="!cliente.editando">{{ cliente.direccion }}</span>
              <input v-else v-model="cliente.direccion" class="venta-input" />
            </td>
            <td data-label="Teléfono">
              <span v-if="!cliente.editando">{{ cliente.telefono }}</span>
              <input v-else v-model="cliente.telefono" class="venta-input" />
            </td>
            <td data-label="Email">
              <span v-if="!cliente.editando">{{ cliente.email }}</span>
              <input v-else v-model="cliente.email" class="venta-input" />
            </td>
            <td data-label="Acciones">
              <button v-if="!cliente.editando" class="venta-button" @click="seleccionarCliente(cliente)">Editar</button>
              <button v-else class="venta-button" @click="actualizarCliente(cliente)">Guardar</button>
              <button v-if="cliente.editando" class="venta-button" @click="cancelarEdicion(cliente)">Cancelar</button>
              <button class="venta-button" @click="eliminarCliente(cliente.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
};