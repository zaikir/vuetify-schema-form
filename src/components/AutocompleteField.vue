<script>
import { VAutocomplete } from 'vuetify/lib/components';

export default {
  functional: true,
  render(createElement, context) {
    return createElement(VAutocomplete, {
      ...context.data,
      class: {
        ...context.data.class || {},
        'vdk-autocomplete-field': true,
      },
    }, context.children);
  },
};
</script>
<style>
.vdk-autocomplete-field.v-input--dense .v-select__slot {
  margin-top: -2px !important;
}
</style>
