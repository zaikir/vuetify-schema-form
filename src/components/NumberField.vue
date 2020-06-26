<script>
import { VTextField } from 'vuetify/lib/components';
import { createSlots, translate } from '../utils';


export default {
  functional: true,
  render(createElement, context) {
    const { data } = context;
    return createElement(VTextField, {
      ...data,
      props: {
        ...data.props || {},
        type: 'number',
        step: 0.01,
        rules: [
          ...data.props.rules || [],
          (x) => !x || parseFloat(x).toString() === x.toString() || translate(context.parent.$vuetify, 'wrongFormat', 'Wrong format'),
        ],
      },
      attrs: {
        autocomplete: 'off',
      },
    }, createSlots(createElement, context.slots()));
  },
};
</script>
