<template>
  <v-text-field
    v-model="currentValue"
    v-bind="$attrs"
  />
</template>

<script>
import Cleave from 'cleave.js';

export default {
  props: {
    value: {
      type: [String, Number],
      required: false,
      default: null,
    },
    mask: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentValue: this.value,
      isChanged: false,
    };
  },
  mounted() {
    this.cleave = new Cleave(this.$el.querySelector('input'), {
      ...this.mask,
      onValueChanged: this.onValueChanged.bind(this),
    });

    this.cleave.setRawValue(this.value);
  },
  methods: {
    onValueChanged({ target }) {
      this.$nextTick(() => {
        if (target.value && target.value.length > 0) {
          this.isChanged = true;
        }

        if (this.isChanged) {
          this.currentValue = target.value;
          this.$emit('input', target.rawValue);
          this.$emit('change', target.rawValue);
        }
      });
    },
  },
};
</script>
