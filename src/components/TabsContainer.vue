<template>
  <div class="vsh-tabs-container">
    <v-bottom-navigation
      grow
      mandatory
      small
      v-model="selectedTab"
      app
      :shift="tabs.find(x => x.label)"
    >
      <v-btn v-for="(tab, i) in tabs" :key="i">
        <span>{{tab.label}}</span>
        <v-icon>{{tab.icon}}</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-window v-model="selectedTab">
      <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
      <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData"><slot :name="name" v-bind="slotData" /></template>
    </v-window>
  </div>
</template>
<script>
import { VTabs } from 'vuetify/lib/components';
import TasksTableVue from '../../../../old/components/TasksTable.vue';
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
