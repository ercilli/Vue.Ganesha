export default {
  name: 'GenericForm',
  props: {
    fields: {
      type: Array,
      required: true
    },
    submitButtonText: {
      type: String,
      default: 'Enviar'
    },
    toggleButtonText: {
      type: String,
      default: 'Crear Nuevo'
    }
  },
  data() {
    return {
      isExpanded: false,
      formData: this.fields.reduce((acc, field) => {
        acc[field.name] = field.default || '';
        return acc;
      }, {})
    };
  },
  methods: {
    toggleForm() {
      this.isExpanded = !this.isExpanded;
    },
    submitForm() {
      // Emitir el evento de envío con los datos del formulario
      this.$emit('submit', this.formData);
      // Resetear el formulario después de enviarlo
      this.formData = this.fields.reduce((acc, field) => {
        acc[field.name] = field.default || '';
        return acc;
      }, {});
      this.isExpanded = false;
    }
  },
  template: `
    <div class="generic-form-container">
      <button @click="toggleForm" class="toggle-button">
        {{ isExpanded ? 'Cerrar Formulario' : toggleButtonText }}
      </button>
      <div v-if="isExpanded" class="form-content">
        <form @submit.prevent="submitForm">
          <div v-for="field in fields" :key="field.name" class="form-group">
            <label :for="field.name">{{ field.label }}</label>
            <input :type="field.type" :id="field.name" v-model="formData[field.name]" :required="field.required" />
          </div>
          <button type="submit" class="submit-button">{{ submitButtonText }}</button>
        </form>
      </div>
    </div>
  `
};