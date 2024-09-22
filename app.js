import Producto from './Components/Producto.js';
import Stock from './Components/Stock.js';
import Venta from './Components/Venta.js';
import Facturacion from './Components/Facturacion.js';
import Footer from './Components/Footer.js';
import Header from './Components/Header.js';
import Cliente from './Components/Cliente.js';
import Proveedor from './Components/Proveedor.js';
import Modal from './Components/Modal.js'; // Asegúrate de que la ruta sea correcta

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
    'producto': Producto,
    'venta': Venta,
    'stock': Stock,
    'facturacion': Facturacion,
    'app-footer': Footer,
    'app-header': Header,
    'cliente': Cliente,
    'proveedor': Proveedor,
    'modal': Modal // Asegúrate de que el nombre del componente esté en minúsculas
  }
});

app.mount('#app');