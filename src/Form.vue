<script>
import clone from 'clone';

export default {
  name: 'VuetifySchemaForm',
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    gapped: {
      type: Boolean,
      default: false,
    },
    fields: {
      type: [Array, Object],
      default: null,
    },
    context: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      clone: {},
    };
  },
  watch: {
    value: {
      handler(val) {
        this.clone = clone(val);
      },
      immediate: true,
    },
  },
  methods: {
    submit() {
      if (!this.$refs.editForm.validate()) {
        return;
      }

      this.$emit('submit', this.clone);
    },
    reset() {
      if (this.$refs.editForm) {
        this.clone = {};
        this.$refs.editForm.resetValidation();
      }
    },
  },
  render(createElement) {
    const actualComponentTree = this.fields
      ? fieldCompiler(this.fields.length ? { type: 'row', fields: this.fields } : this.fields)
      : componentsTree;

    return createElement(Form || VForm, {
      props: {
        lazyValidation: true,
      },
      class: 'py-2',
      ref: 'editForm',
      on: {
        submit: (event) => {
          this.submit();
          event.preventDefault();
        },
      },
    }, [
      renderComponents(createElement, actualComponentTree, this.clone, {
        globalProps: {
          dense: this.$attrs.dense === undefined ? true : this.$attrs.dense,
        },
        globalClasses: {
          ...this.gapped && { 'mb-1': true },
        },
        ...this.reactive && {
          onInput: () => this.$emit('input', this.clone),
          onChange: () => this.$emit('change', this.clone),
        },
      }),
    ]);
  },
};
</script>
