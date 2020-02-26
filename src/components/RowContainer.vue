<script>
import { VRow } from 'vuetify/lib/components'
import { attrsToProps } from '../utils'

export default {
  functional: true,
  render (createElement, context) {
    const data = attrsToProps(context.data)
    return createElement(VRow, {
      ...data
    }, context.children)
  }
}
</script>
