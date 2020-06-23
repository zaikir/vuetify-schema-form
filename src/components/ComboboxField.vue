<script>
import { VCombobox } from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  functional: true,
  render(createElement, context) {
    const { data } = context;

    return createElement(VCombobox, {
      ...data,
      class: {
        ...data.class || {},
        'vdk-combobox-field': true,
      },
      on: {
        ...data.on,
      },
    }, createSlots(createElement, context.slots()));
  },
};
</script>
<style>
/* .vdk-combobox-field.v-input--dense .v-select__slot {
  margin-top: -2px !important;
  padding-bottom: 2px;
} */
</style>
