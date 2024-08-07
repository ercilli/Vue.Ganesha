import DataGrid from './Components/DataGrid.js';
import Stock from './Components/Stock.js';
import Venta from './Components/Venta.js';
import Facturacion from './Components/Facturacion.js';
import { fetchItems } from './Services/apiService.js'; 

const app = Vue.createApp({
  data() {
    return {
      products: []
    };
  },
  components: {
    'data-grid': DataGrid,
    'venta': Venta,
    'stock': Stock,
    'facturacion': Facturacion
  },
  mounted() {
    // Use fetchItems with the 'Producto' controller to fetch products
    fetchItems('Producto').then(data => {
      this.products = data;
    }).catch(error => console.error('Error al cargar los productos:', error));
  }
});

app.mount('#app');