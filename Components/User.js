import { fetchUsers, updateUserRole, deleteUser } from '../Services/userService.js';

export default {
  data() {
    return {
      users: [],
      error: null,
      loading: false, // Estado de carga
      loadingUserId: null // Estado de carga específico para cada usuario
    };
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        this.error = null; // Reset error before loading users
        this.loading = true; // Iniciar estado de carga
        this.users = await fetchUsers();
      } catch (error) {
        console.error('Error loading users:', error); // Log del error
        this.error = 'Error loading users';
      } finally {
        this.loading = false; // Finalizar estado de carga
      }
    },
    async changeUserRole(userId, newRole) {
      try {
        this.error = null; // Reset error before changing user role
        this.loadingUserId = userId; // Iniciar estado de carga específico para el usuario
        await updateUserRole(userId, newRole);
        await this.loadUsers(); // Reload users after role change
      } catch (error) {
        console.error('Error changing user role:', error); // Log del error
        this.error = 'Error changing user role';
      } finally {
        this.loadingUserId = null; // Finalizar estado de carga específico para el usuario
      }
    },
    async removeUser(userId) {
      try {
        this.error = null; // Reset error before deleting user
        this.loadingUserId = userId; // Iniciar estado de carga específico para el usuario
        await deleteUser(userId);
        await this.loadUsers(); // Reload users after deletion
      } catch (error) {
        console.error('Error deleting user:', error); // Log del error
        this.error = 'Error deleting user';
      } finally {
        this.loadingUserId = null; // Finalizar estado de carga específico para el usuario
      }
    }
  },
  template: `
    <div class="user-container">
      <h2 class="user-header">Gestión de Usuarios</h2>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="loading" class="loading">Cargando...</div>
      <table class="user-table" v-if="!loading">
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select v-model="user.role" @change="changeUserRole(user.id, user.role)" :disabled="loadingUserId === user.id" class="user-input">
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </td>
            <td>
              <button @click="removeUser(user.id)" :disabled="loadingUserId === user.id" class="user-button">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
};