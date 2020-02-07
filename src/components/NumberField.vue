<script>
import { VTextField } from 'vuetify/lib/components'
import { attrsToProps } from '../utils'

export default {
  functional: true,
  render (createElement, context) {
    const data = attrsToProps(context.data)
    return createElement(VTextField, {
      ...data,
      props: {
        ...data.props,
        type: 'number',
        step: 0.01,
        rules: [
          ...data.props.rules || [],
          x => !x || parseFloat(x).toString() === x.toString() || 'Неверный формат' // To do: add localization support
        ]
      },
      on: {
        ...data.on || {},
        input (val) {
          data.on.input && data.on.input(parseFloat(val))
        },
        change (val) {
          data.on.change && data.on.change(parseFloat(val))
        }
      }
    }, context.children)
  }
}
</script>
