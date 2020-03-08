<script>
import { VTextField } from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  functional: true,
  render(createElement, context) {
    const { data } = context;
    return createElement(VTextField, {
      ...data,
      props: {
        ...data.props || {},
        type: 'password',
        autocomplete: 'password',
      },
    }, createSlots(createElement, context.slots()));
  },
};
</script>
