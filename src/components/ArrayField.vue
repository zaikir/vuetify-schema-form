<script>
import { VBtn, VIcon, VTextField, VSubheader } from 'vuetify/lib/components'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    inputType: {
      type: String,
      default: 'text'
    }
  },
  data () {
    return {
      input: null
    }
  },
  render (createElement) {
    const items = this.value || []
    return createElement('div', {
      class: 'd-flex flex-column'
    },
    [
      createElement(VSubheader, { class: 'caption pl-0', style: 'height: 4px;' }, this.$attrs.label),
      createElement(VTextField, {
        props: {
          ...this.$attrs,
          label: undefined,
          dense: true,
          type: this.inputType,
          placeholder: this.$attrs.placeholderNew || 'Введите значение',
          value: this.input
        },
        on: {
          input: (val) => {
            this.input = val
          }
        }
      }, [
        createElement(VBtn, {
          props: { icon: true },
          slot: 'prepend-inner',
          on: {
            click: () => {
              if (this.input && this.input.length) {
                this.$emit('input', [this.input, ...items])
                this.$emit('change', [this.input, ...items])

                this.input = null
              }
            }
          }
        }, [
          createElement(VIcon, 'add')
        ])
      ]),
      ...items.map((item, id) => createElement(VTextField, {
        props: {
          ...this.$attrs,
          value: item,
          dense: true,
          type: this.inputType,
          label: undefined
        },
        on: {
          input: (val) => {
            const newItems = items.map((x, i) => i === id ? val : x)
            this.$emit('input', newItems)
            this.$emit('change', newItems)
          }
        }
      }, [
        createElement(VBtn, {
          props: { icon: true },
          slot: 'prepend-inner',
          on: {
            click: () => {
              const newItems = items.filter((x, i) => i !== id)
              this.$emit('input', newItems)
              this.$emit('change', newItems)
            }
          }
        }, [
          createElement(VIcon, 'remove')
        ])
      ]))
    ])
  }
}
</script>
