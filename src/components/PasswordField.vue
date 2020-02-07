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
        type: 'password',
        autocomplete: 'password'
      }
    }, context.children)
  }
}
</script>
