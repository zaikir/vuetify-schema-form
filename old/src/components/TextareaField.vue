<script>
import { VTextarea } from 'vuetify/lib/components'
import { attrsToProps } from '../utils'

export default {
  functional: true,
  render (createElement, context) {
    const data = attrsToProps(context.data)
    return createElement(VTextarea, {
      ...data
    }, context.children)
  }
}
</script>
