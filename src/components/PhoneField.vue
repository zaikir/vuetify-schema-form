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
        rules: [
          ...data.props.rules || [],
          x => !x || x === x.replace(/[^0-9]*/g, '') || 'Неверный формат' // To do: add localization support
        ]
      }
    }, context.children)
  }
}
</script>
