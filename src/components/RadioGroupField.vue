<script>
import { VRadioGroup, VRadio } from 'vuetify/lib/components'

export default {
  functional: true,
  render (createElement, context) {
    return createElement(VRadioGroup, {
      ...context.data
    },
    (context.data.props || {}).items.map((option, i) => createElement(VRadio, {
      props: {
        ...option
      },
      key: i
    })))
  }
}
</script>
