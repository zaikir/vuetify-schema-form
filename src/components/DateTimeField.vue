<script>
import { VDatePicker, VMenu, VTextField } from 'vuetify/lib/components'
import moment from 'moment-mini'

export default {
  props: {
    value: String,
    timezone: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      currentValue: null
    }
  },
  computed: {
    timezoneString () {
      return `${this.timezone >= 0 ? '+' : '-'}${Math.abs(this.timezone).toString().padStart(2, 0)}:00`
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  },
  mounted () {
    this.currentValue = this.value
  },
  render (createElement) {
    const createTextField = on => createElement(VTextField, {
      props: {
        ...this.$attrs,
        value: this.currentValue && moment(this.currentValue).utcOffset(this.timezone * 60).format('YYYY-MM-DDTHH:mm:00').substr(0, 19),
        type: 'datetime-local'
      },
      attrs: {
        max: '9999-12-31T23:59',
        maxlength: '4',
        required: !!this.$attrs.required
      },
      class: {
        ...this.class || {},
        'gf-datetime-field': true
      },
      on: {
        input: (val) => {
          this.currentValue = val && (val + this.timezoneString)
        }
      }
    })

    if (!this.$vuetify.breakpoint.xsOnly) {
      return createElement(VMenu, {
        props: {
          closeOnContentClick: false,
          transition: 'scale-transition',
          offsetY: true,
          minWidth: '290px',
          maxWidth: '290px',
          dense: true,
          ...this.$attrs.menuProps || {}
        },
        scopedSlots: {
          activator: ({ on }) => createTextField({
            ...on,
            ...this.$listeners
          })
        }
      }, [
        !this.$vuetify.breakpoint.xsOnly && createElement(VDatePicker, {
          props: {
            noTitle: true,
            firstDayOfWeek: 1,
            dense: true,
            ...this.$attrs.datePickerProps || {},
            value: this.currentValue && this.currentValue.substr(0, 10)
          },
          on: {
            input: (val) => {
              this.currentValue = val && (val + 'T00:00:00' + this.timezoneString)
            }
          }
        })
      ])
    } else {
      return createTextField(this.$listeners)
    }
  }
}
</script>
<style>
.gf-datetime-field input::-webkit-inner-spin-button,
.gf-datetime-field input::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}
</style>
