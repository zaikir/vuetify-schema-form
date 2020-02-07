<script>
import { VAutocomplete } from 'vuetify/lib/components'

export default {
  functional: true,
  render (createElement, context) {
    return createElement(VAutocomplete, {
      ...context.data
    }, context.children)
  }
}
</script>
