<script>
import Cleave from 'cleave.js';
import { VTextField } from 'vuetify/lib/components';

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
  render(h) {
    return h(VTextField, {
      props: {
        ...this.$attrs,
        value: this.currentValue,
      },
      on: {
        ...this.$listeners,
        input: (val) => {
          this.currentValue = val;
        },
      },
      // on: this.$listeners,
    });
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
