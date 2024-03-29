<script>
import Cleave from 'cleave.js';
import { VTextField } from 'vuetify/lib/components';
import { createSlots } from '../utils';

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
    restrict: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      currentValue: this.value,
      currentRawValue: this.value,
      isChangedInitially: false,
      isChanged: false,
    };
  },
  watch: {
    value(val) {
      if (val !== this.currentRawValue) {
        this.cleave.setRawValue(val);
      }
    },
  },
  mounted() {
    const input = this.$el.querySelector('input');
    this.cleave = new Cleave(input, {
      ...this.mask,
      onValueChanged: this.onValueChanged.bind(this),
    });

    input.addEventListener('blur', () => {
      if (this.isChanged) {
        this.$emit('change', this.currentRawValue);
        this.isChanged = false;
      }
    }, { passive: true });


    this.cleave.setRawValue(this.value);
  },
  render(h) {
    return h(VTextField, {
      props: {
        ...this.$attrs,
        value: this.currentValue,
      },
      attrs: {
        autocomplete: (this.$attrs || {}).autocomplete || 'nope',
        type: (this.$attrs || {}).inputType || 'search',
      },
      on: {
        ...this.$listeners,
        change: () => {},
        input: (val) => { 
          const restrictedValue = this.restrict && this.restrict(val);
          if (restrictedValue.check) {
            this.cleave.setRawValue(restrictedValue.value);
            this.currentValue = restrictedValue.value
            return
          }
          
          this.currentValue = val
        },
      },
    }, createSlots(h, this.$slots));
  },
  methods: {
    onValueChanged({ target }) {
      const restrictedValue = this.restrict && this.restrict(target.rawValue);
      if (target.rawValue && restrictedValue && restrictedValue.check) {
        this.cleave.setRawValue(restrictedValue.value);
      } else {
        if (target.value && target.value.length > 0) {
          this.isChangedInitially = true;
        }

        this.isChanged = true;

        if (this.isChangedInitially) {
          this.currentValue = target.value;
          this.currentRawValue = target.rawValue;
          this.$emit('input', target.rawValue);
        }
      }
    },
  },
};
</script>
