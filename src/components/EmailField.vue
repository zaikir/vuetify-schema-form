<script>
import { VTextField } from 'vuetify/lib/components'
import EmailValidator from 'email-validator'
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
          x => !x || EmailValidator.validate(x) || 'Неверный формат' // To do: add localization support
        ]
      }
    }, context.children)
  }
}
</script>
