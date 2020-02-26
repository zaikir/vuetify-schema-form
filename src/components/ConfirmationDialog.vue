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
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text v-if="text" class="pt-4">
        <span class="body-1 font-weight-black">
          {{ text }}
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
          <span>{{ declineLabel }}</span>
        </v-btn>
        <v-btn
          text
          class="body-1 font-weight-medium"
          color="primary"
          @click="confirm"
        >
          <span>{{ confirmLabel }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: 'Внимание!'
    },
    color: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: String,
      default: 'warning'
    },
    text: {
      type: String,
      default: 'Вы уверены?'
    },
    confirmLabel: {
      type: String,
      required: false,
      default: 'Да'
    },
    declineLabel: {
      type: String,
      required: false,
      default: 'Нет'
    }
  },
  data () {
    return {
      valueCopy: false
    }
  },
  watch: {
    value () {
      this.valueCopy = this.value
    },
    valueCopy () {
      this.$emit('input', this.valueCopy)
    }
  },
  created () {
    this.valueCopy = this.value
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    decline () {
      this.$emit('decline')
    }
  }
}
</script>
