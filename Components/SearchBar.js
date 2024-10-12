export default {
  name: 'SearchBar',
  props: {
    items: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Buscar...'
    },
    searchKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      query: '',
      filteredItems: []
    };
  },
  methods: {
    onInput() {
      if (this.query.trim() === '') {
        this.filteredItems = [];
      } else {
        this.filteredItems = this.items.filter(item => 
          item[this.searchKey].toLowerCase().includes(this.query.toLowerCase())
        );
      }
      this.$emit('filtered', this.filteredItems);
    },
    handlePorcentajeInput(producto) {
      if (producto.porcentaje !== 0) {
        producto.precioDescuento = 0;
      }
    },
    handlePrecioDescuentoInput(producto) {
      if (producto.precioDescuento !== 0) {
        producto.porcentaje = 0;
      }
    },
    agregarDescuentoDesdeProducto(producto) {
      this.$emit('agregar-descuento', producto);
    }
  },
  template: `
    <div class="searchbar-container">
      <input 
        type="text" 
        class="searchbar-input" 
        v-model="query" 
        @input="onInput" 
        :placeholder="placeholder" 
      />
      <span class="searchbar-icon">🔍</span>
      <div v-if="filteredItems.length > 0">
        <table class="searchbar-coincidencias-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Un.</th>
              <th>%</th>
              <th>$</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in filteredItems" :key="producto.id">
              <td>{{ producto.descripcion }}</td>
              <td><input v-model="producto.cantidadMinima" type="number" class="searchbar-descuento-input" /></td>
              <td><input v-model="producto.porcentaje" type="number" class="searchbar-descuento-input" @input="handlePorcentajeInput(producto)" /></td>
              <td><input v-model="producto.precioDescuento" type="number" class="searchbar-descuento-input" :disabled="producto.porcentaje !== 0" @input="handlePrecioDescuentoInput(producto)" /></td>
              <td><button class="searchbar-descuento-button agregar" @click="agregarDescuentoDesdeProducto(producto)"><i class="fas fa-plus"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
};