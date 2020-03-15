<template>
  <v-dialog
    v-model="valueCopy"
    max-width="350px"
  >
    <v-card>
      <v-toolbar dark :color="color" dense>
        <v-icon class="mr-3">
          {{ icon }}
        </v-icon>
        <v-toolbar-title class="headline font-weight-medium">
          {{ translate('confirmationTitle', 'Warning') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pt-4">
        <span class="body-1 font-weight-black">
          {{ translate('confirmationText', 'Are you sure?') }}
        </span>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          class="body-1 font-weight-medium"
          color="secondary"
          @click="decline"
        >
          <span>{{ translate('confirmationDeclineLabel', 'No') }}</span>
        </v-btn>
        <v-btn
          text
          class="body-1 font-weight-medium"
          color="primary"
          @click="confirm"
        >
          <span>{{ translate('confirmationLabel', 'Yes') }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { translate } from '../utils';

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
    icon: {
      type: String,
      default: 'warning',
    },
    title: String,
    text: String,
    confirmLabel: String,
    declineLabel: String,
  },
  data() {
    return {
      valueCopy: false,
    };
  },
  watch: {
    value() {
      this.valueCopy = this.value;
    },
    valueCopy() {
      this.$emit('input', this.valueCopy);
    },
  },
  created() {
    this.valueCopy = this.value;
  },
  methods: {
    translate(key, defaultValue) {
      return translate(this.$vuetify, key, defaultValue);
    },
    confirm() {
      this.$emit('confirm');
    },
    decline() {
      this.$emit('decline');
    },
  },
};
</script>
