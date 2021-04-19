<template>
  <v-tab :key="key">
    <v-tooltip :disabled="!tooltip">
      <template #activator="{on, attrs}">
        <div v-on="on" v-bind="attrs">
          <v-icon v-if="icon" class="mr-2">
            {{ icon }}
          </v-icon>
          {{ label || "" }}
        </div>
      </template>
      {{ tooltip }}
    </v-tooltip>
  </v-tab>
</template>
<script>
export default {
  props: {
    key: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    }
  }
};
</script>
