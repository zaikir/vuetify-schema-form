<template>
  <v-tab>
    <v-tooltip :disabled="!tooltip || (label && label.length) ? true : false" bottom>
      <template #activator="{on, attrs}">
        <div v-on="on" v-bind="attrs" style="width: 100%;height:100%;" class="d-flex align-center justify-center">
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
