<script>
import { VDatePicker, VMenu, VTextField } from 'vuetify/lib/components';
import moment from 'moment';

export default {
  props: {
    value: String,
    timezone: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currentValue: null,
    };
  },
  computed: {
    timezoneString() {
      return `${this.timezone >= 0 ? '+' : '-'}${Math.abs(this.timezone).toString().padStart(2, 0)}:00`;
    },
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
    this.currentValue = this.value || null;
  },
  render(createElement) {
    const createTextField = (on) => createElement(VTextField, {
      props: {
        ...this.$attrs,
        value: this.currentValue && moment(this.currentValue).utcOffset(this.timezone * 60).format('YYYY-MM-DDTHH:mm:00').substr(0, 19),
        type: 'datetime-local',
      },
      attrs: {
        max: '9999-12-31T23:59',
        maxlength: '4',
        required: !!this.$attrs.required,
      },
      class: {
        ...this.class || {},
        'vdk-datetime-field': true,
      },
      on: {
        ...on,
        change: (val) => {
          this.currentValue = (val && (val + this.timezoneString));
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
        createElement(VDatePicker, {
          props: {
            noTitle: true,
            firstDayOfWeek: 1,
            dense: true,
            ...this.$attrs.datePickerProps || {},
            value: this.currentValue && this.currentValue.substr(0, 10),
          },
          on: {
            input: (val) => {
              if (!this.currentValue || !this.currentValue.startsWith(val)) {
                this.currentValue = (val && (`${val}T00:00:00${this.timezoneString}`)) || null;
              }
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
.vdk-datetime-field input::-webkit-inner-spin-button,
.vdk-datetime-field input::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}


.vdk-datetime-field.v-input--dense input {
  padding-top: 3px !important;
  padding-bottom: 1px !important;
}
</style>
