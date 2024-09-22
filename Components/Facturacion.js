import { fetchItems } from '../Services/apiService.js';

export default {
  data() {
    return {
      facturacion: [],
      availableProducts: [],
      facturaSeleccionada: null,
      error: null
    };
  },
  methods: {
    async fetchFacturacion() {
      try {
        console.log("Fetching facturacion data...");
        const data = await fetchItems('Facturacion');
        console.log("Facturacion data fetched:", data);
        this.facturacion = data; // Asumiendo que hay múltiples facturaciones para mostrar
      } catch (error) {
        this.error = "Error fetching facturacion data: " + error.message;
        console.error(this.error);
      }
    },
    async fetchAvailableProducts() {
      try {
        console.log("Fetching available products...");
        const products = await fetchItems('Producto');
        console.log("Available products fetched:", products);
        this.availableProducts = products;
      } catch (error) {
        this.error = "Error fetching products data: " + error.message;
        console.error(this.error);
      }
    },
    mostrarDetalle(factura) {
      console.log("Showing details for factura:", factura);
      this.facturaSeleccionada = factura;
      console.log("Showing details for facturaSeleccionada:", JSON.stringify(this.facturaSeleccionada, null, 2));
    },
    obtenerCodigoProducto(productoId) {
      console.log("Getting product code for productId:", productoId);
      const producto = this.availableProducts.find(product => product.id === productoId);
      const codigo = producto ? producto.codigo : 'N/A';
      console.log("Product code:", codigo);
      return codigo;
    },
    obtenerDescripcionProducto(productoId) {
      console.log("Getting product description for productId:", productoId);
      const producto = this.availableProducts.find(product => product.id === productoId);
      const descripcion = producto ? producto.descripcion : 'N/A';
      console.log("Product description:", descripcion);
      return descripcion;
    },
    formatearImporte(value) {
      return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }).replace('COP', '').trim();
    }
  },
  computed: {
    totalSemanal() {
      const hoy = new Date();
      const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
      return this.facturacion
        .filter(factura => new Date(factura.fecha) >= inicioSemana)
        .reduce((total, factura) => total + factura.total, 0);
    },
    totalMensual() {
      const hoy = new Date();
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      return this.facturacion
        .filter(factura => new Date(factura.fecha) >= inicioMes)
        .reduce((total, factura) => total + factura.total, 0);
    },
    totalFacturacion() {
      return this.facturacion.reduce((total, factura) => total + factura.total, 0);
    }
  },
  created() {
    console.log("Component created. Fetching initial data...");
    this.fetchFacturacion();
    this.fetchAvailableProducts();
  },
  template: `
    <div class="facturacion-container">
      <div v-if="error">{{ error }}</div>
      <div v-else>
        <div v-if="facturacion">
          <h2 class="facturacion-header">Facturación</h2>
          <table class="facturacion-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Importe</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="factura in facturacion" :key="factura.facturacionid">
                <td>{{ factura.facturacionid }}</td>
                <td>{{ factura.fecha }}</td>
                <td>{{ factura.cliente.nombre }} {{ factura.cliente.apellido }}</td>
                <td>{{ formatearImporte(factura.total) }}</td>
                <td><button class="facturacion-button" @click="mostrarDetalle(factura)">Detalle</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="facturaSeleccionada">
          <h2 class="facturacion-header">Detalle de Factura</h2>
          <table class="facturacion-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in facturaSeleccionada.facturas" :key="item.facturaid">
                <td>{{ obtenerCodigoProducto(item.productoid) }}</td>
                <td>{{ obtenerDescripcionProducto(item.productoid) }}</td>
                <td>{{ item.cantidad }}</td>
                <td>{{ formatearImporte(item.precio) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3>Total Semanal: {{ formatearImporte(totalSemanal) }}</h3>
          <h3>Total Mensual: {{ formatearImporte(totalMensual) }}</h3>
          <h3>Total Facturación Realizada: {{ formatearImporte(totalFacturacion) }}</h3>
        </div>
      </div>
    </div>
  `
};