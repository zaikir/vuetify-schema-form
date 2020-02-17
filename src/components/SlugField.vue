<script>
import slugify from 'slugify'
import { VTextField, VTooltip, VBtn, VIcon } from 'vuetify/lib/components'
import { attrsToProps } from '../utils'

export default {
  functional: true,
  render (createElement, context) {
    const slugRule = x => !x || x === slugify(x) || 'Неверный формат'

    const data = attrsToProps(context.data)
    return createElement(VTextField, {
      ...data,
      props: {
        ...data.props,
        rules: [...data.props.rules || [], slugRule]
      },
      scopedSlots: {
        ...data.scopedSlots
      }
    }, [
      ...context.children || [],
      createElement(VTooltip, {
        props: { bottom: true },
        slot: 'append',
        scopedSlots: {
          activator: ({ on }) => createElement(VBtn, {
            props: { icon: true, xSmall: true },
            on: {
              ...on,
              click: () => {
                const newVal = slugify(data.props.item[data.props.basedOn || 'name']).toLowerCase()

                data.on.change && data.on.change(newVal)
                data.on.input && data.on.input(newVal)
              }
            }
          }, [createElement(VIcon, { large: true }, 'mdi-reply-outline')])
        }
      }, 'Сгенерировать')
    ])
  }
}
// createElement(VTooltip, {
//           props: { bottom: true },
//           scopedSlots: {
//             activator: ({ on }) => createElement(VBtn, {
//               props: { icon: true },
//               on: {
//                 ...on,
//                 click: () => {
//                   const newVal = slugify(data.props.value)

//                   this.$emit('input', newVal)
//                   this.$emit('change', newVal)
//                 }
//               },
//               scopedSlots: {
//                 default: () => createElement(VIcon, 'mdi-reply-outline')
//               }
//             })
//           }
//         })
// <template>
//   <v-text-field
//     v-else-if="field.type === 'slug'"
//     v-model="editableItem[field.value]"
//     :rules="[...getRules(field), slugRule]"
//     :placeholder="field.placeholder"
//     :required="conditionalFunction(field.required)"
//     :label="field.text"
//     :disabled="readonly || conditionalFunction(field.disabled)"
//     :outlined="field.outlined"
//     :prefix="conditionalFunction(field.prefix)"
//     :suffix="conditionalFunction(field.suffix)"
//     dense
//     @input="onFieldValueChanged(field, $event)"
//   >
//     <template #append>
//       <v-tooltip bottom>
//         <template #activator="{on}">
//           <v-btn icon @click="setSlug(editableItem, field.value, field.basedOn || 'name')" v-on="on">
//             <v-icon>mdi-reply-outline</v-icon>
//           </v-btn>
//         </template>
//         Сгенерировать
//       </v-tooltip>
//     </template>
//   </v-text-field>
// </template>

</script>
