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
        type: 'number',
        step: 1,
        rules: [
          ...data.props.rules || [],
          (x) => !x || parseInt(x, 10).toString() === x.toString() || 'Неверный формат', // To do: localization
        ],
      },
    }, createSlots(createElement, context.slots()));
  },
};
</script>
