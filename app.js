import DataGrid from './Components/DataGrid.js';
import { fetchProducts } from './Services/apiService.js';

const app = Vue.createApp({
  data() {
    return {
      products: []
    };
  },
  components: {
    'data-grid': DataGrid
  },
  mounted() {
    fetchProducts().then(data => {
      this.products = data;
    }).catch(error => console.error('Error al cargar los productos:', error));
  }
});

app.mount('#app');