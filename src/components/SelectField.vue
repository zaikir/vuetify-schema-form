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
