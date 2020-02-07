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
        step: 1,
        rules: [
          ...data.props.rules || [],
          x => !x || parseInt(x, 10).toString() === x.toString() || 'Неверный формат' // To do: add localization support
        ]
      },
      on: {
        ...data.on || {},
        input (val) {
          data.on.input && data.on.input(parseInt(val, 10))
        },
        change (val) {
          data.on.change && data.on.change(parseInt(val, 10))
        }
      }
    }, context.children)
  }
}
</script>
