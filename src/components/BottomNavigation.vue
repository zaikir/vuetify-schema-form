<script>
import { VBottomNavigation } from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  functional: true,
  render(createElement, context) {
    const { data } = context;

    return createElement(VBottomNavigation, {
      ...data,
      class: {
        ...data.class || {},
        'vsf-bottom-navigation': true,
      },
    }, createSlots(createElement, context.slots()));
  },
};
</script>
