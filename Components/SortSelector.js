export default {
  name: 'SortSelector',
  template: `
	<select v-model="selected" @change="emitSortCriteria">
	  <option value="codigo">Código</option>
	  <option value="descripcion">Descripción</option>
	  <option value="tipo">Tipo</option>
	  <option value="precio">Precio</option>
	</select>
  `,
  data() {
	return {
	  selected: 'codigo', // Default sort criteria
	};
  },
  methods: {
	emitSortCriteria() {
	  this.$emit('sortCriteriaChanged', this.selected);
	},
  },
};
