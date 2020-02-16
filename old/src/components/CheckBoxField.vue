<script>
import { VCheckbox } from 'vuetify/lib/components'
import { attrsToProps } from '../utils'

export default {
  functional: true,
  render (createElement, context) {
    const data = attrsToProps(context.data)
    return createElement(VCheckbox, {
      ...data,
      class: {
        'mt-0': true,
        ...data.class || {}
      },
      on: {
        ...data.on || {},
        change (val) {
          data.on.change && data.on.change(!!val)
          data.on.input && data.on.input(!!val)
        }
      }
    }, context.children)
  }
}
</script>
