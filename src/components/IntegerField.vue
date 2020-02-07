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
        step: 1,
        rules: [
          ...context.data.props.rules || [],
          x => !x || parseInt(x, 10).toString() === x.toString() || 'Неверный формат' // To do: add localization support
        ]
      },
      on: {
        ...context.data.on || {},
        input (val) {
          context.data.on.input && context.data.on.input(parseInt(val, 10))
        },
        change (val) {
          context.data.on.change && context.data.on.change(parseInt(val, 10))
        }
      }
    }, context.children)
  }
}
</script>
