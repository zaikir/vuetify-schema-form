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
      default: (item) => item,
    },
    debounceTimeout: {
      type: Number,
      default: 400,
    },
    filter: [Boolean, String, Function],
    filterParamName: {
      type: String,
      default: 'where',
    },
    filterParamType: {
      type: String,
    },
    fetchAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      items: [],
      search: '',
    };
  },
  watch: {
    query: {
      handler() {
        this.fetchItems();
      },
      immediate: true,
    },
    search(val) {
      if (!val) {
        this.$emit('input', null);
        this.$emit('change', null);
      }
      this.fetchItems(val);
    },
  },
  methods: {
    fetchItems(val) {
      if (!this.fetchAll && (!val || !(val || '').length)) {
        return;
      }

      if (this.fetchAll && this.items && this.items.length) {
        return;
      }

      this.isLoading = true;

      if (this.queryTimer) {
        clearTimeout(this.queryTimer);
      }

      this.queryTimer = setTimeout(async () => {
        const queryName = /[^{]*/.exec(this.query)[0].trim();
        const queryString = !this.filter
          ? `query { ${this.query} }`
          : `query Search($query: ${this.filterParamType ? this.filterParamType : `${queryName}_bool_exp`}) { ${this.query.replace(queryName, `${queryName} (${this.filterParamName}: $query)`)} }`;

        this.$apollo.addSmartQuery('items', {
          query: gql(queryString),
          update: (data) => data[queryName],
          variables: this.filter && {
            query: this.getFilter(),
          },
        });

        const { data: { [queryName]: items } } = await this.$apollo.query({
          query: gql(queryString),
          variables: this.filter && {
            query: this.getFilter(),
          },
        });

        this.items = items.map(this.onResponse);

        this.isLoading = false;
      }, this.debounceTimeout);
    },
    getFilter() {
      if (!this.filter || this.fetchAll) {
        return null;
      }

      if (typeof this.filter === 'string') {
        return { [this.filter]: { _ilike: `%${this.search}%` } };
      }

      if (typeof this.filter === 'function') {
        return this.filter(this.search);
      }

      return { [this.$attrs.itemText || 'text']: { _ilike: `%${this.search}%` } };
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
      },
      on: {
        ...this.$listeners,
        'update:search-input': (val) => {
          if (!val) {
            this.search = null;// this.$emit('change', null);
          }
          if (typeof val === 'string') {
            this.search = val;
          }
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
