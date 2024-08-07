import { fetchItems, createItem } from '../Services/apiService.js';

export default {
	data() {
	  return {
		currentTab: 'Stock',
		tabs: ['Stock', 'Ingreso de Stock', 'Perdida de Stock'],
		stockItems: [],
		availableProducts: [],
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
	  Promise.all([this.fetchStockItems(), this.fetchAvailableProducts()])
		.then(() => {
		  this.updateStockItemsWithProductDetails();
		});
	},
	methods: {
	  fetchStockItems() {
		fetchItems('Stock').then(items => {
		  const updatedStockItems = items.map(stockItem => {
			const product = this.availableProducts.find(product => product.productoid === stockItem.productoId);
			return {
			  ...stockItem,
			  codigo: product ? product.codigo : '',
			  descripcion: product ? product.descripcion : '',
			};
		  });
		  this.stockItems = updatedStockItems;
		});
	  },
	  fetchAvailableProducts() {
		fetchItems('Producto').then(products => {
		  this.availableProducts = products;
		});
	  },
	  updateStockItemsWithProductDetails() {
		this.stockItems = this.stockItems.map(stockItem => {
		  const product = this.availableProducts.find(product => product.productoid === stockItem.productoId);
		  return {
			...stockItem,
			codigo: product ? product.codigo : '',
			descripcion: product ? product.descripcion : '',
		  };
		});
	  },
	  agregarNuevoStock() {
		const productoEncontrado = this.availableProducts.find(producto => producto.descripcion === this.newStockEntry.descripcion);
		if (productoEncontrado) {
		  const stockData = {
			productoid: productoEncontrado.productoid,
			proveedorid: parseInt(this.newStockEntry.proveedor),
			fecha: this.newStockEntry.fecha,
			cantidad: this.newStockEntry.cantidad
		  };
		  createItem('IngresoStock', stockData).then(() => {
			this.fetchStockItems();
			this.newStockEntry = {
			  codigo: '',
			  descripcion: '',
			  cantidad: 1,
			  fecha: new Date().toISOString().slice(0, 10),
			  proveedor: ''
			};
		  }).catch(error => {
			console.error('Error al agregar nuevo stock:', error);
		  });
		} else {
		  console.error('Producto no encontrado');
		}
	  },
	  agregarPerdidaStock() {
		createItem('StockLoss', this.stockLoss).then(() => {
		  this.fetchStockItems();
		  this.stockLoss = {
			codigo: '',
			descripcion: '',
			cantidad: 0,
			fecha: new Date().toISOString().slice(0, 10)
		  };
		});
	  },
	  buscarProductoPorCodigoODescripcion(tipo, model) {
		const busqueda = tipo === 'codigo' ? model.codigo : model.descripcion.toLowerCase();
		const productoEncontrado = this.availableProducts.find(producto =>
		  tipo === 'codigo' ? producto.codigo == busqueda : producto.descripcion.toLowerCase().includes(busqueda)
		);
  
		if (productoEncontrado) {
		  model.codigo = productoEncontrado.codigo;
		  model.descripcion = productoEncontrado.descripcion;
		  if (model.cantidad === undefined) model.cantidad = 1;
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
			  </tr>
			</thead>
			<tbody>
			  <tr v-for="item in stockItems" :key="item.codigo">
				<td>{{ item.codigo }}</td>
				<td>{{ item.descripcion }}</td>
				<td>{{ item.cantidad }}</td>
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
			<input v-model="newStockEntry.proveedor" placeholder="Proveedor" class="stock-input">
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