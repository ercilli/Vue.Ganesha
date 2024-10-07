import { fetchItems, createItem, updateItem, deleteItem } from '../Services/apiService.js';

export default {
  data() {
    return {
      currentTab: 'Stock',
      tabs: ['Stock', 'Ingreso de Stock', 'Perdida de Stock'],
      stockItems: [],
      availableProducts: [],
      availableProveedores: [], // Agregar estado para proveedores
      newStockEntry: {
        codigo: '',
        descripcion: '',
        cantidad: 1,
        fecha: new Date().toISOString().slice(0, 10),
        proveedor: ''
      },
      stockLoss: {
        codigo: '',
        descripcion: '',
        cantidad: 0,
        fecha: new Date().toISOString().slice(0, 10)
      }
    }
  },
  mounted() {
    console.log('Component mounted');
    this.loadData();
  },
  methods: {
    loadData() {
      console.log('Loading data');
      Promise.all([this.fetchStockItems(), this.fetchAvailableProducts(), this.fetchAvailableProveedores()])
        .then(() => {
          this.updateStockItemsWithProductDetails();
        });
    },
    fetchStockItems() {
      console.log('Fetching stock items');
      return fetchItems('Stock').then(items => {
        console.log('Stock items fetched:', items);
        this.stockItems = items;
        console.log('Updated stock items:', this.stockItems);
      }).catch(error => {
        console.error('Error fetching stock items:', error);
      });
    },
    fetchAvailableProducts() {
      console.log('Fetching available products');
      return fetchItems('Producto').then(products => {
        console.log('Available products fetched:', products);
        this.availableProducts = products;
      }).catch(error => {
        console.error('Error fetching available products:', error);
      });
    },
    fetchAvailableProveedores() {
      console.log('Fetching available proveedores');
      return fetchItems('Proveedor').then(proveedores => {
        console.log('Available proveedores fetched:', proveedores);
        this.availableProveedores = proveedores;
      }).catch(error => {
        console.error('Error fetching available proveedores:', error);
      });
    },
    updateStockItemsWithProductDetails() {
      console.log('Updating stock items with product details');
      this.stockItems = this.stockItems.map(stockItem => {
        const product = this.availableProducts.find(product => product.id === stockItem.productoId);
        return {
          ...stockItem,
          codigo: product ? product.codigo : '-',
          descripcion: product ? product.descripcion : '-',
        };
      });
      console.log('Stock items after update:', this.stockItems);
    },
    agregarNuevoStock() {
      console.log('Adding new stock entry:', this.newStockEntry);
      const productoEncontrado = this.availableProducts.find(producto => producto.descripcion === this.newStockEntry.descripcion);
      if (productoEncontrado) {
        const stockData = {
          productoid: productoEncontrado.id,
          proveedorid: parseInt(this.newStockEntry.proveedor),
          fecha: this.newStockEntry.fecha,
          cantidad: this.newStockEntry.cantidad
        };
        console.log('Stock data to be added:', stockData);
        createItem('IngresoStock', stockData).then(() => {
          console.log('New stock entry added successfully');
          this.fetchStockItems();
          this.newStockEntry = {
            codigo: '',
            descripcion: '',
            cantidad: 1,
            fecha: new Date().toISOString().slice(0, 10),
            proveedor: ''
          };
        }).catch(error => {
          console.error('Error adding new stock entry:', error);
        });
      } else {
        console.error('Producto no encontrado');
      }
    },
    agregarPerdidaStock() {
      console.log('Adding stock loss entry:', this.stockLoss);
      const productoEncontrado = this.availableProducts.find(producto => producto.codigo === this.stockLoss.codigo);
      if (productoEncontrado) {
        const stockLossData = {
          productoid: productoEncontrado.id,
          cantidad: this.stockLoss.cantidad,
          fecha: this.stockLoss.fecha
        };
        console.log('Stock loss data to be added:', stockLossData);
        createItem('PerdidaStock', stockLossData).then(() => {
          console.log('Stock loss entry added successfully');
          this.stockLoss = {
            codigo: '',
            descripcion: '',
            cantidad: 0,
            fecha: new Date().toISOString().slice(0, 10)
          };
        }).catch(error => {
          console.error('Error adding stock loss entry:', error);
        });
      } else {
        console.error('Producto no encontrado');
      }
    },
    buscarProductoPorCodigoODescripcion(tipo, model) {
      console.log(`Searching product by ${tipo}:`, model);
      const busqueda = tipo === 'codigo' ? model.codigo : model.descripcion.toLowerCase();
      const productoEncontrado = this.availableProducts.find(producto =>
        tipo === 'codigo' ? producto.codigo == busqueda : producto.descripcion.toLowerCase().includes(busqueda)
      );

      if (productoEncontrado) {
        model.codigo = productoEncontrado.codigo;
        model.descripcion = productoEncontrado.descripcion;
        if (model.cantidad === undefined) model.cantidad = 1;
        console.log('Product found:', productoEncontrado);
      } else {
        console.error('Product not found');
      }
    },
    seleccionarStock(stock) {
      stock.editando = true;
    },
    actualizarStock(stock) {
      const stockData = {
        id: stock.stockId,
        productoid: stock.productoId,
        cantidad: stock.cantidad,
        fecha: stock.fecha
      };
      updateItem('Stock', stockData)
        .then(() => {
          stock.editando = false;
          this.fetchStockItems();
        })
        .catch(error => {
          console.error('Error al actualizar el stock:', error);
          this.error = 'Error al actualizar el stock';
        });
    },
    cancelarEdicion(stock) {
      stock.editando = false;
      this.fetchStockItems();
    },
    eliminarStock(stockId) {
      deleteItem('Stock', stockId)
        .then(() => {
          this.fetchStockItems();
        })
        .catch(error => {
          console.error('Error al eliminar el stock:', error);
          this.error = 'Error al eliminar el stock';
        });
    }
  },
  watch: {
    currentTab(newTab, oldTab) {
      console.log(`Tab changed from ${oldTab} to ${newTab}`);
      if (newTab === 'Stock') {
        this.loadData();
      }
    }
  },
  template: `
    <div class="stock-container">
      <div class="stock-header">
        <button v-for="tab in tabs" :key="tab" @click="currentTab = tab" class="stock-button">{{ tab }}</button>
      </div>
      <div v-if="currentTab === 'Stock'">
        <h2>Stock Actual</h2>
        <table class="stock-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Acciones</th> <!-- Nueva columna para acciones -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in stockItems" :key="item.codigo">
              <td>{{ item.codigo }}</td>
              <td>
                <span v-if="!item.editando">{{ item.descripcion }}</span>
                <input v-else v-model="item.descripcion" class="stock-input" />
              </td>
              <td>
                <span v-if="!item.editando">{{ item.cantidad }}</span>
                <input v-else type="number" v-model="item.cantidad" class="stock-input" />
              </td>
              <td>
                <button v-if="!item.editando" class="stock-button" @click="seleccionarStock(item)">Editar</button>
                <button v-else class="stock-button" @click="actualizarStock(item)">Guardar</button>
                <button v-if="item.editando" class="stock-button" @click="cancelarEdicion(item)">Cancelar</button>
                <button class="stock-button" @click="eliminarStock(item.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="currentTab === 'Ingreso de Stock'">
        <h2>Ingreso de Stock</h2>
        <div class="stock-form">
          <input v-model="newStockEntry.codigo" placeholder="Código" @blur="buscarProductoPorCodigoODescripcion('codigo', newStockEntry)" class="stock-input">
          <input v-model="newStockEntry.descripcion" placeholder="Descripción" @blur="buscarProductoPorCodigoODescripcion('descripcion', newStockEntry)" class="stock-input">
          <input type="number" v-model.number="newStockEntry.cantidad" class="stock-input">
          <input type="date" v-model="newStockEntry.fecha" class="stock-input">
          <select v-model="newStockEntry.proveedor" class="stock-input">
            <option v-for="proveedor in availableProveedores" :key="proveedor.id" :value="proveedor.id">{{ proveedor.nombre }}</option>
          </select>
          <button @click="agregarNuevoStock" class="stock-button">Agregar</button>
        </div>
      </div>
      <div v-if="currentTab === 'Perdida de Stock'">
        <h2>Perdida de Stock</h2>
        <div class="stock-form">
          <input v-model="stockLoss.codigo" placeholder="Código" @blur="buscarProductoPorCodigoODescripcion('codigo', stockLoss)" class="stock-input">
          <input v-model="stockLoss.descripcion" placeholder="Descripción" @blur="buscarProductoPorCodigoODescripcion('descripcion', stockLoss)" class="stock-input">
          <input type="number" v-model.number="stockLoss.cantidad" class="stock-input">
          <input type="date" v-model="stockLoss.fecha" class="stock-input">
          <button @click="agregarPerdidaStock" class="stock-button">Registrar Pérdida</button>
        </div>
      </div>
    </div>
  `,
}