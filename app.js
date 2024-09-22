import Producto from './Components/Producto.js';
import Stock from './Components/Stock.js';
import Venta from './Components/Venta.js';
import Facturacion from './Components/Facturacion.js';
import { fetchItems } from './Services/apiService.js'; 
import Footer from './Components/Footer.js';
import Header from './Components/Header.js';
import Cliente from './Components/Cliente.js';
import Proveedor from './Components/Proveedor.js';


const app = Vue.createApp({
  data() {
    return {
      products: []
    };
  },
  components: {
    'producto': Producto,
    'venta': Venta,
    'stock': Stock,
    'facturacion': Facturacion,
    'app-footer': Footer,
    'app-header': Header,
    'cliente': Cliente,
    'proveedor': Proveedor
  },
  mounted() {
    // Use fetchItems with the 'Producto' controller to fetch products
    fetchItems('Producto').then(data => {
      this.products = data;
    }).catch(error => console.error('Error al cargar los productos:', error));
  }
});

app.mount('#app');