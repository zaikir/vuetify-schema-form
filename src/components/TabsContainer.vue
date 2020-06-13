
<script>
import {
  VWindow, VBtn, VIcon, VBottomNavigation,
} from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedTab: 0,
      currentValue: null,
      showValidationErrors: false,
    };
  },
  render(h) {
    return h('div', { class: 'vsh-tabs-container' }, [
      h(VBottomNavigation, {
        props: {
          grow: true,
          mandatory: true,
          small: true,
          value: this.selectedTab,
          app: true,
        },
        on: {
          change: (val) => {
            this.selectedTab = val;
          },
        },
      }, this.tabs.map((tab) => h(VBtn, [h(VIcon, [tab.icon])]))),
      h(VWindow, {
        props: { value: this.selectedTab },
        on: {
          change: (val) => {
            this.selectedTab = val;
          },
        },
      }, createSlots(h, this.$slots)),
    ]);
  },
};
</script>
<style>
.vsh-tabs-container .v-item-group.v-bottom-navigation .v-btn {
  min-width: 15px !important;
}

.vsh-tabs-container .v-bottom-navigation button {
  padding: 0px !important;
}
</style>
