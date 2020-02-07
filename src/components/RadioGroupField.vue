<script>
import { VRadioGroup, VRadio } from 'vuetify/lib/components'
import { attrsToProps } from '../utils'

export default {
  functional: true,
  render (createElement, context) {
    const data = attrsToProps(context.data)
    return createElement(VRadioGroup, {
      ...data
    },
    (data.props || {}).items.map((option, i) => createElement(VRadio, {
      props: {
        ...option
      },
      key: i
    })))
  }
}
</script>
