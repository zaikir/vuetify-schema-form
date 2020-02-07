<script>
import { VSelect } from 'vuetify/lib/components'

export default {
  functional: true,
  render (createElement, context) {
    return createElement(VSelect, {
      ...context.data
    }, context.children)
  }
}
</script>
