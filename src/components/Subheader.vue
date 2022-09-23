<script>
import { VSwitch } from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  functional: true,
  render(createElement, context) {
    return createElement('h3', { class: 'mb-2' }, context.data.props.label);
  },
};
</script>
