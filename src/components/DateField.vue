<script>
import { VDatePicker, VMenu, VTextField } from 'vuetify/lib/components';
import { createSlots } from '../utils';

export default {
  props: {
    value: String,
  },
  data() {
    return {
      currentValue: null,
      showValidationErrors: false,
    };
  },
  watch: {
    value(val = null) {
      this.currentValue = val;
    },
  },
  mounted() {
    this.currentValue = this.value;
    setTimeout(() => { this.showValidationErrors = true; }, 1000);
  },
  methods: {
    emit(newVal) {
      this.$emit('input', newVal);
      this.$emit('change', newVal);
    },
  },
  render(createElement) {
    const createTextField = (on) => createElement(VTextField, {
      ref: 'datetime',
      props: {
        ...this.$attrs,
        value: this.currentValue,
        ...!this.showValidationErrors && { error: false },
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
          this.emit(val);
        },
      },
    }, createSlots(createElement, this.$slots));

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
        on: {
          input: (isOpened) => {
            this.showValidationErrors = !isOpened;
          },
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
              this.emit(val);
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
