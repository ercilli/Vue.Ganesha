import { fetchItems, createItem } from '../Services/apiService.js';
import SearchBar from './SearchBar.js';
import MyModal from './Modal.js';

export default {
  components: {
    SearchBar,
    MyModal
  },
  data() {
    return {
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalType: '',
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
      productosFiltrados: [] // Lista de productos filtrados
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
    closeModal() {
      this.showModal = false;
    },
    fetchDescuentos() {
      fetchItems('DescuentoCantidad')
        .then(data => {
          this.availableDescuentos = data;
        })
        .catch(error => {
          console.error('Error al cargar los descuentos:', error);
          this.error = 'Error al cargar los descuentos';
        });
    },
    buscarProductoPorCodigoODescripcion(index, tipo) {
      const detalle = this.facturaDetails[index];
      const busqueda = tipo === 'codigo' ? detalle.codigo : detalle.descripcion.toLowerCase();
      const productoEncontrado = this.availableProducts.find(producto =>
        tipo === 'codigo' ? producto.codigo == busqueda : producto.descripcion.toLowerCase().includes(busqueda)
      );

      if (productoEncontrado) {
        const descuento = this.availableDescuentos.find(d => d.productoId === productoEncontrado.id && detalle.cantidad >= d.cantidadMinima);
        let precioConDescuento = productoEncontrado.precio;
        let porcentajeDescuento = 0;
        let precioDescuento = 0;
        let descuentoId = null;
        let tipoDescuento = '';

        if (descuento) {
          descuentoId = descuento.id;
          if (descuento.porcentaje !== 0) {
            porcentajeDescuento = descuento.porcentaje;
            tipoDescuento = '%';
            precioConDescuento = productoEncontrado.precio - (productoEncontrado.precio * (descuento.porcentaje / 100));
          } else {
            precioDescuento = descuento.precioDescuento;
            tipoDescuento = '$';
            precioConDescuento = productoEncontrado.precio - descuento.precioDescuento;
          }
        }

        this.facturaDetails[index] = {
          ...detalle,
          productoid: productoEncontrado.id,
          codigo: productoEncontrado.codigo,
          descripcion: productoEncontrado.descripcion,
          precio: precioConDescuento,
          cantidad: detalle.cantidad || 1,
          subtotal: precioConDescuento * (detalle.cantidad || 1),
          descuento: porcentajeDescuento || precioDescuento,
          descuentoId: descuentoId,
          tipoDescuento: tipoDescuento
        };
      }
    },
    updateProductTotal(index) {
      const product = this.facturaDetails[index];
      const descuento = this.availableDescuentos.find(d => d.productoId === product.productoid && product.cantidad >= d.cantidadMinima);
      let precioConDescuento = product.precio;
      let porcentajeDescuento = 0;
      let precioDescuento = 0;
      let descuentoId = null;
      let tipoDescuento = '';

      if (descuento) {
        descuentoId = descuento.id;
        if (descuento.porcentaje !== 0) {
          porcentajeDescuento = descuento.porcentaje;
          tipoDescuento = '%';
          precioConDescuento = product.precio - (product.precio * (descuento.porcentaje / 100));
        } else {
          precioDescuento = descuento.precioDescuento;
          tipoDescuento = '$';
          precioConDescuento = product.precio - descuento.precioDescuento;
        }

        // Limitar la cantidad a la cantidad mínima del descuento
        if (product.cantidad > descuento.cantidadMinima) {
          product.cantidad = descuento.cantidadMinima;
        }
      }

      product.subtotal = product.cantidad * precioConDescuento - (precioDescuento || 0);
      product.descuento = porcentajeDescuento || precioDescuento; // Actualizar el descuento aplicado
      product.descuentoId = descuentoId; // Actualizar el ID del descuento aplicado
      product.tipoDescuento = tipoDescuento; // Actualizar el tipo de descuento
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

      let totalDescuento = 0;

      const venta = {
        clienteID: this.facturaHeader.clienteid,
        productos: this.facturaDetails.map(detalle => {
          const producto = {
            productoID: detalle.productoid,
            cantidad: detalle.cantidad,
            subtotal: detalle.subtotal,
            descuento: detalle.descuento,
            tipoDescuento: detalle.descuentoId !== null ? 'cantidad' : 'no_aplica'
          };

          if (detalle.descuentoId !== null) {
            producto.descuentoId = parseInt(detalle.descuentoId, 10);
            const descuento = this.availableDescuentos.find(d => d.id === producto.descuentoId);
            if (descuento && descuento.precioDescuento !== 0) {
              totalDescuento += descuento.precioDescuento;
            }
          }

          return producto;
        }),
        total: this.calcularTotalFactura(),
        fecha: this.facturaHeader.fecha
      };

      console.log('Venta enviada al backend:', venta);

      createItem('Venta', venta)
        .then(response => {
          if (response) {
            this.modalTitle = 'Éxito';
            this.modalMessage = 'Venta creada con éxito.';
            this.modalType = 'success'; // Asegúrate de que este valor sea válido
            this.showModal = true;
            this.finalizarFactura();
          } else {
            this.modalTitle = 'Error';
            this.modalMessage = 'Error al crear la venta.';
            this.modalType = 'error'; // Asegúrate de que este valor sea válido
            this.showModal = true;
          }
        })
        .catch(error => {
          this.modalTitle = 'Error';
          this.modalMessage = 'Error al crear la venta: ' + error.message;
          this.modalType = 'error'; // Asegúrate de que este valor sea válido
          this.showModal = true;
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    agregarDetalleVacio() {
      this.facturaDetails.push({
        codigo: '',
        descripcion: '',
        cantidad: 1,
        precio: 0,
        subtotal: 0,
        descuento: 0,
        descuentoId: null,
        tipoDescuento: null,
        productoid: null
      });
    },
    formatCurrency(value) {
      return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }).replace('COP', '').trim();
    },
    handleFilteredProductos(filteredProductos) {
      this.productosFiltrados = filteredProductos;
    }
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
            <th>#</th>
            <th>Descripción</th>
            <th>Un.</th>
            <th>Precio</th>
            <th>Promo</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in facturaDetails" :key="index">
            <td data-label="Código"><input class="venta-input" v-model="item.codigo" placeholder="Código" @blur="buscarProductoPorCodigoODescripcion(index, 'codigo')"></td>
            <td data-label="Descripción"><input class="venta-input" v-model="item.descripcion" placeholder="Descripción" @blur="buscarProductoPorCodigoODescripcion(index, 'descripcion')"></td>
            <td data-label="Cantidad"><input class="venta-input" type="number" v-model.number="item.cantidad" @change="updateProductTotal(index)" :disabled="item.descuentoId !== null"></td>
            <td data-label="Precio">{{ formatCurrency(item.precio) }}</td>
            <td data-label="Descuento">{{ item.descuento ? (item.descuento + item.tipoDescuento) : '0%' }}</td>
            <td data-label="Subtotal">{{ formatCurrency(item.subtotal) }}</td>
            <td data-label="Acciones"><button class="venta-button eliminar" @click="eliminarDetalle(index)"><i class="fas fa-trash"></i></button></td>
          </tr>
        </tbody>
      </table>
      <div class="venta-total-container">
        <div class="venta-total">
          <strong>Total Factura:</strong> {{ formatCurrency(calcularTotalFactura()) }}
        </div>
        <button class="venta-button venta-finalizar-button" @click="generarVenta" :disabled="isSubmitting">Finalizar Factura</button>
      </div>
      <MyModal 
        :show="showModal" 
        :title="modalTitle" 
        :message="modalMessage" 
        :type="modalType" 
        @close="closeModal">
      </MyModal>
    </div>
  `
}