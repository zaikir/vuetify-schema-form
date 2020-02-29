<script>
import { VDatePicker, VMenu, VTextField } from 'vuetify/lib/components';

export default {
  props: {
    value: String,
  },
  data() {
    return {
      currentValue: undefined,
    };
  },
  watch: {
    value(val = null) {
      this.currentValue = val;
    },
    currentValue(val) {
      const actualVal = val && val.length ? val : null;
      this.$emit('input', actualVal);
      this.$emit('change', actualVal);
    },
  },
  mounted() {
    this.currentValue = this.value;
  },
  render(createElement) {
    console.log(this.value);
    const createTextField = (on) => createElement(VTextField, {
      props: {
        ...this.$attrs,
        value: this.currentValue,
      },
      attrs: {
        max: '9999-12-31',
        maxlength: '4',
        required: !!this.$attrs.required,
        type: 'date',
      },
      class: {
        ...this.class || {},
        'vdk-date-field': true,
      },
      on: {
        ...on,
        input: (val) => {
          this.currentValue = val;
        },
      },
    });

    if (!this.$vuetify.breakpoint.xsOnly) {
      return createElement(VMenu, {
        props: {
          transition: 'scale-transition',
          offsetY: true,
          minWidth: '290px',
          maxWidth: '290px',
          dense: true,
          ...this.$attrs.menuProps || {},
        },
        scopedSlots: {
          activator: ({ on }) => createTextField({
            ...on,
            ...this.$listeners,
          }),
        },
      }, [
        !this.$vuetify.breakpoint.xsOnly && createElement(VDatePicker, {
          props: {
            noTitle: true,
            firstDayOfWeek: 1,
            dense: true,
            ...this.$attrs.datePickerProps || {},
            value: this.currentValue,
          },
          on: {
            input: (val) => {
              this.currentValue = val;
            },
          },
        }),
      ]);
    }
    return createTextField(this.$listeners);
  },
};
</script>
<style>
.vdk-date-field input[type="date"]::-webkit-inner-spin-button,
.vdk-date-field input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}

.vdk-date-field.v-input--dense input {
  padding-top: 3px !important;
  padding-bottom: 1px !important;
}

</style>
