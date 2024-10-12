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
        console.log('Loaded users:', this.users); // Verificar los datos recibidos
        // Asegurarse de que cada usuario tenga un rol seleccionado
        this.users.forEach(user => {
          if (user.roles && user.roles.length > 0) {
            user.selectedRole = user.roles[0];
          } else {
            user.selectedRole = 'User'; // Valor por defecto si no hay roles
          }
        });
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
        // Actualizar el rol seleccionado localmente
        const user = this.users.find(user => user.id === userId);
        if (user) {
          user.selectedRole = newRole;
        }
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
            <th>User</th>
            <th>Email</th>
            <th>Rol</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select v-model="user.selectedRole" @change="changeUserRole(user.id, user.selectedRole)" :disabled="loadingUserId === user.id" class="user-input">
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="PendingApproval">Pending</option>
              </select>
            </td>
            <td>
              <i class="fas fa-trash user-icon" @click="removeUser(user.id)" :disabled="loadingUserId === user.id"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
};