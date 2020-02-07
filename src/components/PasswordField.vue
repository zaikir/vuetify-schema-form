<script>
import { VTextField } from 'vuetify/lib/components'

export default {
  functional: true,
  render (createElement, context) {
    return createElement(VTextField, {
      ...context.data,
      props: {
        ...context.data.props,
        type: 'password',
        autocomplete: 'password'
      }
    }, context.children)
  }
}
</script>
