<script>
import { VTabs } from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  functional: true,
  render(h, context) {
    return h(VTabs, context.data, createSlots(h, context.slots()));
  },
};
</script>
