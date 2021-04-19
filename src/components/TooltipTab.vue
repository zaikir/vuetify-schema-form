<template>
  <v-tab>
    <v-tooltip :disabled="!tooltip || (label && label.length) ? true : false" bottom>
      <template #activator="{on, attrs}">
        <div v-on="on" v-bind="attrs" style="width: 100%;height:100%;" class="d-flex align-center justify-center">
          <template v-if="icon">
            <v-badge
              v-if="badge || badge === 0"
              :content="badge || '0'"
              overlap
              class="vsf-tooltip-tab-badge mr-5"
              offset-x="5"
            >
              <v-icon>
                {{ icon }}
              </v-icon>
            </v-badge>
            <v-icon class="mr-2" v-else>
              {{ icon }}
            </v-icon>
          </template>
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
    },
    badge: {
      type: String,
      default: null
    },
    badgeColor: {
      type: String,
      default: 'primary'
    },
    badgeDark: {
      type: Boolean,
      default: true
    }
  }
};
</script>
<style>
.vsf-tooltip-tab-badge span.v-badge__badge {
  background-color: #c5cae9 !important;
  color: black;
  font-size: 12px;
}
</style>