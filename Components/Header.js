import { logoutUser, getUserRole } from '../Services/authService.js';

export default {
  data() {
    return {
      userRole: null
    };
  },
  async created() {
    try {
      this.userRole = await getUserRole();
      console.log('User role:', this.userRole); // Agregar log para verificar el rol del usuario
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
    }
  },
  methods: {
    handleLogout() {
      logoutUser();
      window.location.href = './index.html'; // Redirigir a la página de inicio de sesión
    }
  },
  template: `
    <header class="header">
      <nav class="navbar">
        <h1 class="logo">Vivero Ganesha</h1>

        <label class="labe_hamburguesa" for="menu_hamburguesa">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            fill="currentColor"
            class="list_icon"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </label>

        <input class="menu_hamburguesa" type="checkbox" name="" id="menu_hamburguesa">

        <ul class="ul_links">
          <li class="li_links">
            <a href="./facturacion.html" class="about-button">Facturación</a>
          </li>
          <li class="li_links">
            <a href="./stock.html" class="about-button">Inventario</a>
          </li>
          <li class="li_links">
            <a href="./producto.html" class="about-button">Producto</a>
          </li>
          <li class="li_links">
            <a href="./proveedor.html" class="about-button">Proveedor</a>
          </li>
          <li class="li_links">
            <a href="./cliente.html" class="about-button">Cliente</a>
          </li>
          <li class="li_links">
            <a href="./venta.html" class="about-button">Venta</a>
          </li>
          <li class="li_links">
            <a href="./descuentocantidad.html" class="about-button">Promo</a>
          </li>
          <li class="li_links" v-if="userRole === 'Admin'">
            <a href="./user.html" class="about-button">Gestión de Usuarios</a>
          </li>
          <li class="li_links">
            <a href="./index.html" class="about-button" @click="handleLogout">Cerrar sesión</a>
          </li>
        </ul>
      </nav>
    </header>
  `
};