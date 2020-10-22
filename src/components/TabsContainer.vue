
<script>
import {
  VTabs,
} from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  props: {
    // tabs: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      selectedTab: 0,
    };
  },
  mounted() {
    // window.addEventListener('validation-failed', (e) => { 
    //   console.log(e)
    //  }, false);
  },
  render(h) {
    return h(VTabs, {
      class: 'vsh-tabs',
      props: {
        ...this.$props,
        value: this.selectedTab,
      },
      attrs: {
        ...this.$attrs,
      },
      on: {
        change: (val) => {
          this.selectedTab = val;
        },
      },
    }, createSlots(h, this.$slots));
  },
};
</script>
<style>

</style>
