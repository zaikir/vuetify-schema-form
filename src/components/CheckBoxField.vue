<script>
import { VCheckbox } from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  functional: true,
  render(createElement, context) {
    return createElement(VCheckbox, {
      ...context.data,
      props: {
        ...context.data.props || {},
        inputValue: context.data.props.value,
      },
      class: {
        'mt-0': true,
        ...context.data.class || {},
      },
    }, createSlots(context.slots()));
  },
};
</script>
