import { loginUser, registerUser } from '../Services/authService.js';

export default {
  name: 'Login',
  data() {
    return {
      usuario: {
        email: '',
        password: ''
      },
      isCreatingAccount: false,
      error: null,
      successMessage: null,
      validationErrors: []
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
          // Guardar los tokens en el almacenamiento local
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('tokenExpiry', response.tokenExpiry);
          // Redirigir a la página de ventas
          window.location.href = 'venta.html';
        })
        .catch(error => {
          console.error('Error al iniciar sesión:', error);
          this.error = 'Error al iniciar sesión';
        });
    },
    validatePassword(password) {
      const errors = [];
      if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres.');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('La contraseña debe tener al menos una letra mayúscula.');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('La contraseña debe tener al menos una letra minúscula.');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('La contraseña debe tener al menos un número.');
      }
      return errors;
    },
    createAccount() {
      const passwordErrors = this.validatePassword(this.usuario.password);
      if (passwordErrors.length > 0) {
        this.validationErrors = passwordErrors;
        return;
      }

      registerUser(this.usuario)
        .then(response => {
          // Manejar la respuesta de la creación de cuenta
          console.log('Cuenta creada exitosamente:', response);
          this.successMessage = 'Cuenta creada exitosamente. Por favor, inicie sesión.';
          this.error = null;
          this.validationErrors = [];
          this.isCreatingAccount = false;
        })
        .catch(error => {
          console.error('Error al crear la cuenta:', error);
          if (error.response && error.response.data && error.response.data.message) {
            // Mostrar el mensaje de error devuelto por el servicio
            this.error = error.response.data.message || 'Error al crear la cuenta';
          } else {
            this.error = 'Error al crear la cuenta';
          }
        });
    },
    toggleCreateAccount() {
      this.isCreatingAccount = !this.isCreatingAccount;
      this.error = null;
      this.successMessage = null;
      this.validationErrors = [];
    }
  },
  template: `
    <div class="login-container">
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>
      <ul v-if="validationErrors.length" class="error-list">
        <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
      </ul>
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