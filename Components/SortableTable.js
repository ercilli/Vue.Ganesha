export default {
  name: 'SortableTable',
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
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
      sortColumn: null,
      sortOrder: 'asc',
      paginatedData: [],
      currentPage: 1
    };
  },
  watch: {
    data: {
      immediate: true,
      handler(newData) {
        this.paginateData(newData);
      }
    }
  },
  methods: {
    sortData(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortOrder = 'asc';
      }

      this.data.sort((a, b) => {
        let valA = a[this.sortColumn];
        let valB = b[this.sortColumn];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (this.sortOrder === 'asc') {
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else {
          return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
      });

      this.paginateData(this.data);
    },
    paginateData(data) {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.paginatedData = data.slice(start, end);
      this.$emit('page-changed', this.paginatedData);
    },
    changePage(page) {
      this.currentPage = page;
      this.paginateData(this.data);
    }
  },
  template: `
    <div>
      <table class="sortable-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.name" @click="sortData(column.name)">
              {{ column.label }}
              <span v-if="sortColumn === column.name">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedData" :key="item.id">
            <td v-for="column in columns" :key="column.name">
              {{ item[column.name] }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="changePage(page)" v-for="page in Math.ceil(data.length / itemsPerPage)" :key="page">
          {{ page }}
        </button>
      </div>
    </div>
  `
};