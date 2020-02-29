<script>
import { VSwitch } from 'vuetify/lib/components';

export default {
  functional: true,
  render(createElement, context) {
    return createElement(VSwitch, {
      ...context.data,
      props: {
        ...context.data.props || {},
        inputValue: context.data.props.value,
      },
      class: {
        'mt-0': true,
        ...context.data.class || {},
      },
    }, context.children);
  },
};
</script>
