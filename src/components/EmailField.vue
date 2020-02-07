<script>
import { VTextField } from 'vuetify/lib/components'
import EmailValidator from 'email-validator'

export default {
  functional: true,
  render (createElement, context) {
    return createElement(VTextField, {
      ...context.data,
      props: {
        ...context.data.props,
        rules: [
          ...context.data.props.rules || [],
          x => !x || EmailValidator.validate(x) || 'Неверный формат' // To do: add localization support
        ]
      }
    }, context.children)
  }
}
</script>
