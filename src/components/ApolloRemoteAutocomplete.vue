<script>
import { VAutocomplete } from 'vuetify/lib/components';
import gql from 'graphql-tag';
import { createSlots, translate } from '../utils';

export default {
  props: {
    value: {
      type: null,
    },
    query: {
      type: String,
      required: true,
    },
    onResponse: {
      type: Function,
      default: (item) => item,
    },
    debounceTimeout: {
      type: Number,
      default: 400,
    },
    filter: [Boolean, Function],
    filterParamName: {
      type: String,
      default: 'where',
    },
    filterParamType: {
      type: String,
    },
    initialFetch: Boolean,
  },
  data() {
    return {
      disableFetching: false,
      isLoading: false,
      items: [],
      search: null,
    };
  },
  watch: {
    value() {
      this.fetchItems();
    },
    query: {
      handler() {
        this.fetchItems();
      },
      immediate: true,
    },
    search() {
      this.fetchItems();
    },
  },
  methods: {
    emit(event, val) {
      this.$emit(event, val === undefined ? null : val);
    },
    getQueryString(queryName) {
      if (!this.filter) {
        return `query { ${this.query} }`;
      }

      return `query Search($query: ${this.filterParamType ? this.filterParamType : `${queryName}_bool_exp`}) { ${this.query.replace(queryName, `${queryName} (${this.filterParamName}: $query)`)} }`;
    },
    fetchItems() {
      const hasSearchParams = this.initialFetch || (this.search || '').length || !!this.value;
      if (this.filter && !hasSearchParams) {
        return;
      }

      if (!this.filter && this.items.length) {
        return;
      }

      if (this.disableFetching) {
        this.disableFetching = false;
        return;
      }

      this.isLoading = true;

      if (this.queryTimer) {
        clearTimeout(this.queryTimer);
      }

      this.queryTimer = setTimeout(async () => {
        const queryName = /[^{]*/.exec(this.query)[0].trim();
        const queryString = this.getQueryString(queryName);

        this.$apollo.addSmartQuery('items', {
          query: gql(queryString),
          variables: this.filter && {
            query: this.getFilter(),
          },
          update(data) {
            if (data[queryName]) {
              this.isLoading = false;
              return data[queryName].map(this.onResponse);
            }
          },
        });

        this.queryTimer = null;
      }, this.debounceTimeout);
    },
    getFilter() {
      if (!this.filter) {
        return null;
      }

      const searchField = this.$attrs.itemText || 'text';
      const itemValue = this.$attrs.itemValue || 'value';

      if (!!this.value && !(!!this.search && this.search.length)) {
        this.disableFetching = true;
      }

      const filter = {
        _or: [
          !!this.value && { [itemValue]: { _eq: this.value } },
          !!this.search && this.search.length && { [searchField]: { _ilike: `%${this.search}%` } },
        ].filter((x) => !!x),
      };

      if (typeof this.filter === 'function') {
        return this.filter({ filter, search: this.search, value: this.$attrs.value });
      }

      return filter;
    },
  },
  render(createElement) {
    return createElement(VAutocomplete, {
      class: {
        'vdk-autocomplete-field': true,
      },
      props: {
        ...this.$attrs,
        items: this.items,
        loading: this.isLoading,
        filter: undefined,
        searchInput: this.search,
        placeholder: this.$attrs.placeholder || (this.filter ? translate(this.$vuetify, 'enterToSearch', 'Enter query to search') : ''),
      },
      on: {
        ...this.$listeners,
        'update:search-input': (val) => {
          if (!val) {
            this.search = null;
          }
          if (typeof val === 'string') {
            this.search = val;
          }
        },
        input: (val) => {
          this.emit('input', val);
        },
        change: (val) => {
          this.emit('change', val);
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
