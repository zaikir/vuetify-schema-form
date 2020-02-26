<script>
import clone from 'clone';
import { VForm, VContainer } from 'vuetify/lib/components';
import { buildComponentsTree, renderComponentsTree } from './utils';

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
    root: {
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
    context: {
      type: Object,
      default: () => ({}),
    },
  },
  render(h) {
    const root = !this.fields.length ? this.fields : {
      ...this.root,
      fields: this.fields,
    };
    const tree = buildComponentsTree(root, { defaultProps: this.defaultProps });
    const renderedTree = renderComponentsTree(h, tree);

    return h(VForm,
      { props: { lazyValidation: true }, ref: 'editForm' },
      [
        h(VContainer,
          {},
          [renderedTree]),
      ]);
  },
};
</script>
