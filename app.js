import Producto from './Components/Producto.js';
import Stock from './Components/Stock.js';
import Venta from './Components/Venta.js';
import Facturacion from './Components/Facturacion.js';
import Footer from './Components/Footer.js';
import Header from './Components/Header.js';
import Cliente from './Components/Cliente.js';
import Proveedor from './Components/Proveedor.js';
import MyModal from './Components/MyModal.js'; // Asegúrate de que la ruta sea correcta
import Login from './Components/Login.js';
import User from './Components/User.js';

const app = Vue.createApp({
  data() {
    return {
      products: [],
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalType: ''
    };
  },
  methods: {
    openModal(title, message, type) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalType = type;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  },
  components: {
    'user': User,
    'login': Login,
    'producto': Producto,
    'venta': Venta,
    'stock': Stock,
    'facturacion': Facturacion,
    'app-footer': Footer,
    'app-header': Header,
    'cliente': Cliente,
    'proveedor': Proveedor,
    'modal': MyModal // Asegúrate de que el nombre del componente esté en minúsculas
  }
});

app.mount('#app');