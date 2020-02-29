<template>
  <v-text-field :value="value" class="validation-message" :rules="[x => !!x || 'Введите значение']"/>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
  },
};
</script>
<style>
  .validation-message {
    margin-top: -4px !important;
  }

  .validation-message .v-input__slot {
    display: none !important;
  }
</style>
