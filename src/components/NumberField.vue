<script>
import { VTextField } from 'vuetify/lib/components';

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
          (x) => !x || parseFloat(x).toString() === x.toString() || 'Неверный формат', // ToDo: localization
        ],
      },
    }, context.children);
  },
};
</script>
