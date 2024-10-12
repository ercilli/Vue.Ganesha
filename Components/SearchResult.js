export default {
  name: 'SearchResult',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  template: `
    <div class="search-result-container">
      <slot name="result" :item="item" v-for="item in items" :key="item.id"></slot>
    </div>
  `
};