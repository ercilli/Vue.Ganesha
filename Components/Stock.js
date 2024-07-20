import { fetchItems, createItem } from '../Services/apiService.js';

export default {
  data() {
	return {
	  currentTab: 'Stock',
	  tabs: ['Stock', 'Ingreso de Stock', 'Perdida de Stock'],
	  stockItems: [],
	  availableProducts: [], // Agregado para almacenar los productos disponibles
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
	this.fetchStockItems();
	this.fetchAvailableProducts(); // Método agregado para obtener los productos disponibles
  },
  methods: {
	fetchStockItems() {
		fetchItems('Stock').then(items => {
		  // Mapear cada item de stock para incluir código y descripción desde availableProducts
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
	fetchAvailableProducts() { // Método agregado para obtener los productos disponibles
	  fetchItems('Producto').then(products => {
		this.availableProducts = products;
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
			  proveedor: '',
			  productoid: ''
			};
		  }).catch(error => {
			console.error('Error al agregar nuevo stock:', error);
		  });
		} else {
		  console.error('Producto no encontrado');
		}
	  },
	agregarPerdidaStock() {
	  // Assuming there's a method to create stock loss in your API
	  createItem('StockLoss', this.stockLoss).then(() => {
		this.fetchStockItems(); // Refresh the list
		// Reset stockLoss for next input
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
		if (model.cantidad === undefined) model.cantidad = 1; // Default to 1 for new stock entries
	  }
	}
  },
  template: `
	<div>
	  <div>
		<button v-for="tab in tabs" :key="tab" @click="currentTab = tab">{{ tab }}</button>
	  </div>
	  <div v-if="currentTab === 'Stock'">
		<h2>Stock Actual</h2>
		<table>
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
		<input v-model="newStockEntry.codigo" placeholder="Código" @blur="buscarProductoPorCodigoODescripcion('codigo', newStockEntry)">
		<input v-model="newStockEntry.descripcion" placeholder="Descripción" @blur="buscarProductoPorCodigoODescripcion('descripcion', newStockEntry)">
		<input type="number" v-model.number="newStockEntry.cantidad">
		<input type="date" v-model="newStockEntry.fecha">
		<input v-model="newStockEntry.proveedor" placeholder="Proveedor">
		<button @click="agregarNuevoStock">Agregar</button>
	  </div>
	  <div v-if="currentTab === 'Perdida de Stock'">
		<h2>Perdida de Stock</h2>
		<input v-model="stockLoss.codigo" placeholder="Código" @blur="buscarProductoPorCodigoODescripcion('codigo', stockLoss)">
		<input v-model="stockLoss.descripcion" placeholder="Descripción" @blur="buscarProductoPorCodigoODescripcion('descripcion', stockLoss)">
		<input type="number" v-model.number="stockLoss.cantidad">
		<input type="date" v-model="stockLoss.fecha">
		<button @click="agregarPerdidaStock">Registrar Pérdida</button>
	  </div>
	</div>
  `,
}