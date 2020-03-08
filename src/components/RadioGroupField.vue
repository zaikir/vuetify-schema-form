<script>
import { VRadioGroup, VRadio } from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  functional: true,
  render(createElement, context) {
    return createElement(VRadioGroup, {
      ...context.data,
      props: {
        row: true,
        ...context.data.props || {},
      },
      class: {
        'mt-0': true,
        ...context.data.class || {},
      },
    },
    [
      ...((context.data.props || {}).items || []).map((option, i) => createElement(VRadio, {
        props: { ...option },
        key: i,
      })),
      ...createSlots(this.$slots),
    ]);
  },
};
</script>
