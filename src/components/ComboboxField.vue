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
        input(val) {
          if (data.on.input) {
            data.on.input(typeof val === 'object' ? val[data.props.itemValue || 'value'] : val);
          }
        },
        change(val) {
          if (data.on.change) {
            data.on.change(typeof val === 'object' ? val[data.props.itemValue || 'value'] : val);
          }
        },
      },
    }, createSlots(createElement, context.slots()));
  },
};
</script>
<style>
.vdk-combobox-field.v-input--dense .v-select__slot {
  margin-top: -2px !important;
}
</style>
