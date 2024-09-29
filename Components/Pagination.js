export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.items.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    }
  },
  methods: {
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.$emit('page-changed', this.paginatedItems);
      }
    }
  },
  template: `
    <div>
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="producto-button">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="producto-button">Siguiente</button>
      </div>
      <slot :items="paginatedItems"></slot>
    </div>
  `
};