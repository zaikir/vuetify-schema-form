<script>
import { VCombobox } from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  functional: true,
  render(createElement, context) {
    const { data } = context;

    return createElement(VCombobox, {
      ...data,
      props: {
        ...data.props,
        type: data.props.inputType,
      },
      class: {
        ...data.class || {},
        'vdk-combobox-field': true,
      },
      on: {
        ...data.on,
        change: (e) => {
          if (data.on.change && data.props.inputType === 'number') {
            data.on.change(parseFloat(e))
          } else {
            data.on.change(e)
          }
        }
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
