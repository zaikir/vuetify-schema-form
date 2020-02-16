<script>
import { VCol } from 'vuetify/lib/components'
import { attrsToProps } from '../utils'

export default {
  functional: true,
  render (createElement, context) {
    const data = attrsToProps(context.data)
    return createElement(VCol, {
      ...data
    }, context.children)
  }
}
</script>
