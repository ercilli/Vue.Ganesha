export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['error', 'warning', 'success'].includes(value);
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  },
  template: `
    <div v-if="show" class="modal-overlay">
      <div class="modal">
        <div :class="['modal-header', type]">
          <h3>{{ title }}</h3>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="modal-button">Cerrar</button>
        </div>
      </div>
    </div>
  `
};