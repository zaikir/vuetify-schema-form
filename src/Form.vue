<script>
import clone from 'clone';
import { VForm, VContainer } from 'vuetify/lib/components';
import { buildComponentsTree, renderComponentsTree } from './utils';

function getFields(node) {
  return node.fields ? node.fields.map((field) => getFields(field)) : node;
}

export default {
  name: 'VuetifySchemaForm',
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    fields: {
      type: [Object, Array],
      required: true,
    },
    rootNode: {
      type: Object,
      default: () => ({
        type: 'row',
      }),
    },
    defaultProps: {
      type: Object,
      default: () => ({
        dense: true,
      }),
    },
    defaultClasses: {
      type: Object,
      default: () => ({
        // 'my-1': true,
      }),
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
  computed: {
    root() {
      return !this.fields.length ? this.fields : { ...this.rootNode, fields: this.fields };
    },
    objectFields() {
      return getFields(this.root)
        .flat(Number.POSITIVE_INFINITY)
        .filter((field) => field.value !== undefined);
    },
  },
  watch: {
    value: {
      handler(val) {
        this.initialize(val);
      },
      immediate: true,
    },
    objectFields() {
      this.initialize(this.value);
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
        this.initialize({});
        this.$refs.editForm.resetValidation();
      }
    },
    initialize(initial) {
      this.clone = {
        ...Object.assign({}, ...this.objectFields.map((field) => ({ [field.value]: null }))),
        ...clone(initial),
      };
    },
  },
  render(h) {
    const tree = buildComponentsTree(this.root, {
      defaultProps: this.defaultProps, defaultClasses: this.defaultClasses,
    });
    const renderedTree = renderComponentsTree(h, tree, this.clone,
      (item) => this.$emit('input', item), {
        context: this.context,
        scopedSlots: this.$scopedSlots,
      });

    return h(VForm,
      { props: { lazyValidation: true }, ref: 'editForm' },
      [
        h(VContainer, {
          props: {
            gridListMd: true,
          },
        }, [renderedTree]),
      ]);
  },
};
</script>
