<script>
import { VAutocomplete } from 'vuetify/lib/components'
import { attrsToProps } from '../utils'

export default {
  functional: true,
  render (createElement, context) {
    return createElement(VAutocomplete, {
      ...attrsToProps(context.data)
    }, context.children)
  }
}
</script>
