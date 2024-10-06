import { loginUser } from '../Services/authService.js';

export default {
  name: 'Login',
  data() {
    return {
      usuario: {
        email: '',
        password: ''
      },
      isCreatingAccount: false,
      error: null
    };
  },
  methods: {
    handleSubmit() {
      if (this.isCreatingAccount) {
        this.createAccount();
      } else {
        this.login();
      }
    },
    login() {
      loginUser(this.usuario)
        .then(response => {
          // Manejar la respuesta del login, por ejemplo, guardar el token y redirigir
          console.log('Login exitoso:', response);
          // Guardar el token en el almacenamiento local
          localStorage.setItem('accessToken', response.token);
          // Redirigir a la página de ventas
          window.location.href = 'venta.html';
        })
        .catch(error => {
          console.error('Error al iniciar sesión:', error);
          this.error = 'Error al iniciar sesión';
        });
    },
    createAccount() {
      // Aquí puedes implementar la lógica para crear una cuenta si es necesario
      console.log('Función de creación de cuenta no implementada');
    },
    toggleCreateAccount() {
      this.isCreatingAccount = !this.isCreatingAccount;
      this.error = null;
    }
  },
  template: `
    <div class="login-container">
      <div v-if="error" class="error">{{ error }}</div>
      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="login-form-group">
          <label for="email">Email:</label>
          <input id="email" class="login-input" v-model="usuario.email" placeholder="Email" required />
        </div>
        <div class="login-form-group">
          <label for="password">Password:</label>
          <input id="password" type="password" class="login-input" v-model="usuario.password" placeholder="Password" required />
        </div>
        <button type="submit" class="login-button">{{ isCreatingAccount ? 'Crear Cuenta' : 'Iniciar Sesión' }}</button>
      </form>
      <button @click="toggleCreateAccount" class="toggle-button">
        {{ isCreatingAccount ? 'Ya tengo una cuenta' : 'Crear una cuenta' }}
      </button>
    </div>
  `
};