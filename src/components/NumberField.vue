<script>
import { VTextField } from 'vuetify/lib/components'

export default {
  functional: true,
  render (createElement, context) {
    return createElement(VTextField, {
      ...context.data,
      props: {
        ...context.data.props,
        type: 'number',
        step: 0.01,
        rules: [
          ...context.data.props.rules || [],
          x => !x || parseFloat(x).toString() === x.toString() || 'Неверный формат' // To do: add localization support
        ]
      },
      on: {
        ...context.data.on || {},
        input (val) {
          context.data.on.input && context.data.on.input(parseFloat(val))
        },
        change (val) {
          context.data.on.change && context.data.on.change(parseFloat(val))
        }
      }
    }, context.children)
  }
}
</script>
