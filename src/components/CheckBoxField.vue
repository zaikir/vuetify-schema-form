<script>
import { VCheckbox } from 'vuetify/lib/components'

export default {
  functional: true,
  render (createElement, context) {
    return createElement(VCheckbox, {
      ...context.data,
      class: {
        'mt-0': true,
        ...context.data.class || {}
      },
      on: {
        ...context.data.on || {},
        change (val) {
          context.data.on.change && context.data.on.change(!!val)
          context.data.on.input && context.data.on.input(!!val)
        }
      }
    }, context.children)
  }
}
</script>
