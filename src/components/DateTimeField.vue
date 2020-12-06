<script>
import { VDatePicker, VMenu, VTextField } from 'vuetify/lib/components';
import moment from 'moment';
import { createSlots } from '../utils';

export default {
  props: {
    value: String,
    timezone: {
      type: Number,
    },
    step: { type: Number},
  },
  data() {
    return {
      currentValue: null,
      showValidationErrors: false,
    };
  },
  computed: {
    actualTimezone() {
      return this.timezone ? this.timezone : -(new Date().getTimezoneOffset() / 60);
    },
    timezoneString() {
      return `${this.actualTimezone >= 0 ? '+' : '-'}${Math.abs(this.actualTimezone).toString().padStart(2, 0)}:00`;
    },
  },
  watch: {
    value(val = null) {
      this.currentValue = val;
    },
  },
  mounted() {
    this.currentValue = this.value || null;
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
      ref: 'datetime-input',
      props: {
        ...this.$attrs,
        value: this.currentValue && moment(this.currentValue).utcOffset(this.actualTimezone * 60).format('YYYY-MM-DDTHH:mm:00').substr(0, 19),
        type: 'datetime-local',
        errorCount: this.showValidationErrors ? 1 : 0,
      },
      attrs: {
        max: '9999-12-31T23:59',
        maxlength: '4',
        required: !!this.$attrs.required,
        step: this.step
      },
      class: {
        ...this.class || {},
        'vdk-datetime-field': true,
      },
      on: {
        ...on,
        click: (e) => {
          on.click && on.click(e);
          if (!this.currentValue || !this.currentValue.length) {
            document.activeElement.blur();
            const input = this.$refs['datetime-input'].$el.querySelector('input:not([type=hidden]),textarea:not([type=hidden])');
            if (input) {
              setTimeout(() => { input.focus(); }, 0);
            }
          }
        },
        change: (val) => {
          if (val === '') {
            val = null;
          }

          this.currentValue = (val && (val + this.timezoneString));
          this.emit(this.currentValue);
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
                this.emit(this.currentValue);
              }
              this.$nextTick(() => {
                this.$refs['datetime-input'].focus();
              });
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
