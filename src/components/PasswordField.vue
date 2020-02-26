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
        type: 'password',
        autocomplete: 'password',
      },
    }, context.children);
  },
};
</script>
