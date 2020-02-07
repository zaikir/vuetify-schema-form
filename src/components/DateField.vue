<script>
import { VDatePicker, VMenu, VTextField } from 'vuetify/lib/components'

export default {
  props: {
    value: String
  },
  data () {
    return {
      currentValue: null
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
        value: this.currentValue
      },
      attrs: {
        max: '9999-12-31',
        maxlength: '4',
        required: !!this.$attrs.required
      },
      class: {
        ...this.class || {},
        'gf-date-field': true
      },
      on: {
        ...on,
        input: (val) => {
          this.currentValue = val
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
            value: this.currentValue
          },
          on: {
            input: (val) => {
              this.currentValue = val
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
.gf-date-field input[type="date"]::-webkit-inner-spin-button,
.gf-date-field input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
}
</style>
