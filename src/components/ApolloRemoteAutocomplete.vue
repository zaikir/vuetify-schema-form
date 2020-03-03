<script>
import { VAutocomplete } from 'vuetify/lib/components';
import gql from 'graphql-tag';

export default {
  props: {
    label: {
      type: String,
      default: null,
    },
    query: {
      type: String,
      required: true,
    },
    itemValue: {
      type: String,
      default: 'value',
    },
    itemText: {
      type: String,
      default: 'text',
    },
    rules: {
      type: Array,
      default: () => [],
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    onResponse: {
      type: Function,
      default: (items) => items,
    },
  },
  data() {
    return {
      items: [],
      search: '',
      smartQuery: null,
    };
  },
  watch: {
    query: {
      handler() {
        const query = gql(`query { ${this.query} }`);
        const queryName = query.definitions[0].selectionSet.selections[0].name.value;
        this.$apollo.addSmartQuery('items', {
          query,
          update(data) {
            return data[queryName];
          },
        });
      },
      immediate: true,
    },
  },
  methods: {
    debounceSearch(newSearch) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      this.timeout = setTimeout(() => {
        this.search = newSearch;
      }, 5000);
    },
  },
  render(createElement) {
    return createElement(VAutocomplete, {
      class: {
        'vdk-autocomplete-field': true,
      },
      props: {
        ...this.$attrs,
        items: this.onResponse(this.items),
        loading: this.$apollo.loading,
      },
      on: {
        'update:search-input': (val) => {
          this.debounceSearch(val);
        },
        input: (val) => {
          this.$emit('input', val);
        },
        change: (val) => {
          this.$emit('change', val);
        },
      },
    });
  },
};

</script>
<style>
.vdk-autocomplete-field.v-input--dense .v-select__slot {
  margin-top: -2px !important;
}
</style>
