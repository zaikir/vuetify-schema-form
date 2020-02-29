<script>
import { VTextField } from 'vuetify/lib/components';

export default {
  functional: true,
  render(createElement, context) {
    const { data } = context;
    return createElement(VTextField, {
      ...data,
      props: {
        prefix: '+',
        ...data.props || {},
        type: 'tel',
        rules: [
          ...data.props.rules || [],
          (x) => !x || x === x.replace(/[^0-9]*/g, '') || 'Неверный формат', // To do: localization
        ],
      },
    }, context.children);
  },
};
</script>
