<script>
import Vue from 'vue';
import clone from 'clone';
import { VForm, VContainer } from 'vuetify/lib/components';
import types from './types';
import propsResolver from './propsResolver';
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
      default: null,
    },
    defaultType: {
      type: String,
      default: null,
    },
    globalProps: {
      type: Object,
      default: null,
    },
    globalClasses: {
      type: Object,
      default: null,
    },
    context: {
      type: Object,
      default: () => ({}),
    },
    skeletonLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      clone: {},
    };
  },
  computed: {
    root() {
      const rootNode = this.rootNode || (Vue.$schemaForm && Vue.$schemaForm.rootNode) || { type: 'row' };
      return !this.fields.length ? this.fields : { ...rootNode, fields: this.fields };
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
    const params = Vue.$schemaForm || {};
    const options = {
      types,
      propsResolver,
      ...params,
      defaultType: this.defaultType || params.defaultType || 'text',
      globalProps: this.globalProps || params.globalProps || { dense: true },
      globalClasses: this.globalClasses || params.globalClasses || {},
      $vuetify: this.$vuetify,
    };


    const tree = buildComponentsTree(this.root, options);
    const renderedTree = renderComponentsTree(h, tree, this.clone,
      (item) => this.$emit('input', item), {
        context: this.context,
        scopedSlots: this.$scopedSlots,
        skeletonLoading: this.skeletonLoading,
        ...options,
      });

    return h(VForm,
      { props: { lazyValidation: true }, ref: 'editForm' },
      [
        h(VContainer, {
          props: {
            // gridListMd: true,
            fluid: true,
          },
        }, [renderedTree]),
      ]);
  },
};
</script>
<style>
.vsf-skeleton-loading .v-skeleton-loader__bone {
  height: 70%;
  opacity: 0.6;
}
</style>
