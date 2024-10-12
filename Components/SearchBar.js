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
      <div class="searchbar-input-container">
        <input 
          type="text" 
          class="searchbar-input" 
          v-model="query" 
          @input="onInput" 
          :placeholder="placeholder" 
        />
        <span class="searchbar-icon">🔍</span>
      </div>
      <div v-if="filteredItems.length > 0">
        <slot name="results" :items="filteredItems"></slot>
      </div>
    </div>
  `
};