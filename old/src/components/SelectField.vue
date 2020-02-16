<script>
import { VSelect } from 'vuetify/lib/components'
import { attrsToProps } from '../utils'

export default {
  functional: true,
  render (createElement, context) {
    const data = attrsToProps(context.data)
    return createElement(VSelect, {
      ...data
    }, context.children)
  }
}
</script>
