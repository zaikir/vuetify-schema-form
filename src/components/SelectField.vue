<script>
import { VSelect } from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  functional: true,
  render(createElement, context) {
    const { data } = context;

    return createElement(VSelect, {
      ...data,
      class: {
        ...data.class || {},
        'vdk-select-field': true,
      },
    }, createSlots(createElement, context.slots()));
  },
};
</script>
<style>
.vdk-select-field.v-input--dense .v-select__slot {
  margin-top: -2px !important;
}

.vdk-select-field.v-input--dense.v-input--is-label-active .v-select__slot {
  margin-top: -6px !important;
}

.vdk-select-field .v-select__selection .v-select__selection--comma {
  margin-top: 10px !important;
  margin-bottom: 4px !important;
}
</style>
