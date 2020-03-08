<script>
import { VAutocomplete } from 'vuetify/lib/components';
import gql from 'graphql-tag';
import { createSlots } from '../utils';

export default {
  props: {
    query: {
      type: String,
      required: true,
    },
    onResponse: {
      type: Function,
      default: (items) => items,
    },
    filter: [Boolean, String, Function],
  },
  data() {
    return {
      items: [],
      searchValue: '',
    };
  },
  watch: {
    query: {
      handler() {
        const queryName = /[^{]*/.exec(this.query)[0].trim();
        const queryString = !this.filter
          ? `query { ${this.query} }`
          : `query Search($query: ${queryName}_bool_exp!) { ${this.query.replace(queryName, `${queryName} (where: $query)`)} }`;
        console.log(queryString);
        const query = gql(queryString);
        this.$apollo.addSmartQuery('items', {
          query,
          update(data) {
            return data[queryName];
          },
          variables: this.filter && {
            query: this.getFilter(),
          },
        });
      },
      immediate: true,
    },
  },
  methods: {
    getFilter() {
      if (!this.filter) {
        return null;
      }

      if (typeof this.filter === 'string') {
        return { [this.filter]: { _ilike: `%${this.searchValue}%` } };
      }

      if (typeof this.filter === 'function') {
        return this.filter(this.searchValue);
      }

      return { [this.$attrs.itemText || 'text']: { _ilike: `%${this.searchValue}%` } };
    },
    debounceSearch(newSearch) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      this.timeout = setTimeout(() => {
        this.searchValue = newSearch;
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
        'update:searchValue-input': (val) => {
          this.debounceSearch(val);
        },
        input: (val) => {
          this.$emit('input', val);
        },
        change: (val) => {
          this.$emit('change', val);
        },
      },
    }, createSlots(createElement, this.$slots));
  },
};

</script>
<style>
.vdk-autocomplete-field.v-input--dense .v-select__slot {
  margin-top: -2px !important;
}
</style>
