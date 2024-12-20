import Producto from './Components/Producto.js';
import Stock from './Components/Stock.js';
import Venta from './Components/Venta.js';
import Facturacion from './Components/Facturacion.js';
import Footer from './Components/Footer.js';
import Header from './Components/Header.js';
import Cliente from './Components/Cliente.js';
import Proveedor from './Components/Proveedor.js';
import Login from './Components/Login.js';
import User from './Components/User.js';
import DescuentoCantidad from './Components/DescuentoCantidad.js';

const app = Vue.createApp({
  components: {
    'descuento-cantidad': DescuentoCantidad,
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
  }
});

app.mount('#app');