<script>
import { VTextarea } from 'vuetify/lib/components'

export default {
  functional: true,
  render (createElement, context) {
    return createElement(VTextarea, {
      ...context.data
    }, context.children)
  }
}
</script>
