import { fetchItems, createItem } from '../Services/apiService.js';

export default {
  data() {
    return {
      facturaHeader: {
        clienteid: null,
        nombre: '',
        fecha: new Date().toISOString().slice(0, 10)
      },
      facturaDetails: [],
      availableProducts: [],
      availableClientes: [],
      availableDescuentos: [], // Nuevo estado para almacenar los descuentos
      isSubmitting: false,
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalType: ''
    }
  },
  mounted() {
    fetchItems('Producto').then(products => {
      this.availableProducts = products;
    });
    fetchItems('Cliente').then(clientes => {
      this.availableClientes = clientes;
    });
    fetchItems('DescuentoCantidad').then(descuentos => {
      this.availableDescuentos = descuentos;
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
        const descuento = this.availableDescuentos.find(d => d.productoId === productoEncontrado.id && detalle.cantidad >= d.cantidadMinima);
        const porcentajeDescuento = descuento ? descuento.porcentaje : 0;
        const precioConDescuento = productoEncontrado.precio * (1 - porcentajeDescuento / 100);

        this.facturaDetails[index] = {
          ...detalle,
          productoid: productoEncontrado.id,
          codigo: productoEncontrado.codigo,
          descripcion: productoEncontrado.descripcion,
          precio: precioConDescuento,
          cantidad: detalle.cantidad || 1,
          subtotal: precioConDescuento * (detalle.cantidad || 1),
          descuento: porcentajeDescuento // Nuevo campo para almacenar el porcentaje de descuento
        };
      }
    },
    agregarDetalleVacio() {
      this.facturaDetails.push({
        codigo: '',
        descripcion: '',
        cantidad: 0,
        precio: 0.00,
        subtotal: 0.00
      });
    },
    updateProductTotal(index) {
      const product = this.facturaDetails[index];
      const descuento = this.availableDescuentos.find(d => d.productoId === product.productoid && product.cantidad >= d.cantidadMinima);
      const porcentajeDescuento = descuento ? descuento.porcentaje : 0;
      const precioConDescuento = product.precio * (1 - porcentajeDescuento / 100);

      product.subtotal = product.cantidad * precioConDescuento;
      product.descuento = porcentajeDescuento; // Actualizar el porcentaje de descuento
    },
    calcularTotalFactura() {
      return this.facturaDetails.reduce((subtotal, item) => subtotal + item.subtotal, 0);
    },
    finalizarFactura() {
      console.log('Factura finalizada con éxito. Total: ', this.calcularTotalFactura());
      this.generarVenta();
      this.facturaHeader = {
        clienteid: null,
        nombre: '',
        fecha: new Date().toISOString().slice(0, 10)
      };
      this.facturaDetails = [];
    },
    eliminarDetalle(index) {
      this.facturaDetails.splice(index, 1);
    },
    generarVenta() {
      if (this.isSubmitting) return;

      this.isSubmitting = true;

      const venta = {
        clienteID: this.facturaHeader.clienteid,
        productos: this.facturaDetails.map(detalle => ({
          productoID: detalle.productoid,
          cantidad: detalle.cantidad,
          subtotal: detalle.subtotal,
          precio: detalle.precio,
          descuento: detalle.descuento
        })),
        total: this.calcularTotalFactura(),
        fecha: this.facturaHeader.fecha,
        tiposDescuento: ['cantidad'] // Lista de tipos de descuentos a aplicar
      };

      createItem('Venta', venta)
        .then(response => {
          console.log('Venta respuesta:', response);
          if (response) {
            this.$root.openModal('Éxito', 'Venta creada con éxito', 'success');
            this.finalizarFactura();
          } else {
            this.$root.openModal('Error', 'Error al crear la venta', 'error');
          }
        })
        .catch(error => {
          this.$root.openModal('Error', 'Error al crear la venta: ' + error.message, 'error');
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
    template: `
    <div class="venta-container">
      <h1 class="venta-header">Factura</h1>
      <form class="venta-form">
        <div class="venta-form-group">
          <label for="cliente">Cliente:</label>
          <select id="cliente" class="venta-input" v-model="facturaHeader.clienteid">
            <option v-for="cliente in availableClientes" :key="cliente.id" :value="cliente.id">{{ cliente.nombre }} {{ cliente.apellido }}</option>
          </select>
        </div>
        <button type="button" class="venta-button" @click="agregarDetalleVacio">Agregar Producto</button>
      </form>
      <table class="venta-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Descuento (%)</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in facturaDetails" :key="index">
            <td data-label="Código"><input class="venta-input" v-model="item.codigo" placeholder="Código" @blur="buscarProductoPorCodigoODescripcion(index, 'codigo')"></td>
            <td data-label="Descripción"><input class="venta-input" v-model="item.descripcion" placeholder="Descripción" @blur="buscarProductoPorCodigoODescripcion(index, 'descripcion')"></td>
            <td data-label="Cantidad"><input class="venta-input" type="number" v-model.number="item.cantidad" @change="updateProductTotal(index)"></td>
            <td data-label="Precio"><input class="venta-input" type="number" v-model.number="item.precio" @change="updateProductTotal(index)" readonly></td>
            <td data-label="Descuento">{{ item.descuento || 0 }}</td>
            <td data-label="Subtotal">{{ item.subtotal.toFixed(2) }}</td>
            <td data-label="Acciones"><button class="venta-button" @click="eliminarDetalle(index)">Eliminar</button></td>
          </tr>
        </tbody>
      </table>
      <div class="venta-total-container">
        <div class="venta-total">
          <strong>Total Factura:</strong> {{ formatCurrency(calcularTotalFactura()) }}
        </div>
        <button class="venta-button venta-finalizar-button" @click="generarVenta" :disabled="isSubmitting">Finalizar Factura</button>
      </div>
      <modal 
        :show="showModal" 
        :title="modalTitle" 
        :message="modalMessage" 
        :type="modalType" 
        @close="closeModal">
      </modal>
    </div>
  `
}