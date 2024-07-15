import { fetchProducts } from '../Services/apiService.js';

export default {
 data() {
    return {
      facturaHeader: {
        nombre: '',
        apellido: '',
        fecha: new Date().toISOString().slice(0, 10),
        direccion: '',
        telefono: ''
      },
      facturaDetails: [],
      availableProducts: []
    }
  },
  mounted() {
    fetchProducts().then(products => {
      this.availableProducts = products;
    });
  },
  methods: {
    formatCurrency(value) {
        return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }).replace('COP', '').trim();
      },
      buscarProductoPorCodigoODescripcion(index, tipo) {
        const detalle = this.facturaDetails[index];
        const busqueda = tipo === 'codigo' ? detalle.codigo : detalle.descripcion.toLowerCase();
        const productoEncontrado = this.availableProducts.find(producto => 
          tipo === 'codigo' ? producto.codigo == busqueda : producto.descripcion.toLowerCase().includes(busqueda)
        );
      
        if (productoEncontrado) {
          this.facturaDetails[index] = {
            ...detalle,
            codigo: productoEncontrado.codigo,
            descripcion: productoEncontrado.descripcion,
            precio: productoEncontrado.precio,
            cantidad: detalle.cantidad || 1,
            total: productoEncontrado.precio * (detalle.cantidad || 1)
          };
        }
      },
    agregarDetalleVacio() {
      this.facturaDetails.push({
        codigo: '',
        descripcion: '',
        cantidad: 0,
        precio: 0.00,
        total: 0.00
      });
    },
    updateProductTotal(index) {
      const product = this.facturaDetails[index];
      product.total = product.cantidad * product.precio;
    },
    calcularTotalFactura() {
      return this.facturaDetails.reduce((total, item) => total + item.total, 0);
    },
    finalizarFactura() {
      console.log('Factura finalizada con éxito. Total: ', this.calcularTotalFactura());
      this.facturaHeader = {
        nombre: '',
        apellido: '',
        fecha: new Date().toISOString().slice(0, 10),
        direccion: '',
        telefono: ''
      };
      this.facturaDetails = [];
    },
    eliminarDetalle(index) {
      this.facturaDetails.splice(index, 1);
    }
  },
  template: `
     <div>
    <h1>Factura</h1>
    <div>
      <label>Nombre: </label>
      <input v-model="facturaHeader.nombre" placeholder="Nombre del Cliente">
    </div>
    <div>
      <label>Apellido: </label>
      <input v-model="facturaHeader.apellido" placeholder="Apellido del Cliente">
    </div>
    <div>
      <label>Fecha: </label>
      <input type="date" v-model="facturaHeader.fecha">
    </div>
    <div>
      <label>Dirección: </label>
      <input v-model="facturaHeader.direccion" placeholder="Dirección del Cliente">
    </div>
    <div>
      <label>Teléfono: </label>
      <input v-model="facturaHeader.telefono" placeholder="Teléfono del Cliente">
    </div>
    <button @click="agregarDetalleVacio">Agregar Producto</button>
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Descripción</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Subtotal</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in facturaDetails" :key="index">
          <td><input v-model="item.codigo" placeholder="Código" @blur="buscarProductoPorCodigoODescripcion(index, 'codigo')"></td>
          <td><input v-model="item.descripcion" placeholder="Descripción" @blur="buscarProductoPorCodigoODescripcion(index, 'descripcion')"></td>
          <td><input type="number" v-model.number="item.cantidad" @change="updateProductTotal(index)"></td>
          <td><input type="number" v-model.number="item.precio" @change="updateProductTotal(index)" readonly></td>
          <td>{{ item.total.toFixed(2) }}</td>
          <td><button @click="eliminarDetalle(index)">Eliminar</button></td>
        </tr>
      </tbody>
    </table>
    <div>Total Factura: {{ formatCurrency(calcularTotalFactura()) }}</div>
    <button @click="finalizarFactura">Finalizar Factura</button>
  </div>
  `,
}