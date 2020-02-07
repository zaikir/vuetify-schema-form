<script>
import { VTextField } from 'vuetify/lib/components'

export default {
  functional: true,
  render (createElement, context) {
    return createElement(VTextField, {
      ...context.data,
      props: {
        ...context.data.props,
        rules: [
          ...context.data.props.rules || [],
          x => !x || x === x.replace(/[^0-9]*/g, '') || 'Неверный формат' // To do: add localization support
        ]
      }
    }, context.children)
  }
}
</script>
