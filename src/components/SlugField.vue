<script>
import slugify from 'slugify';
import {
  VTextField, VTooltip, VBtn, VIcon,
} from 'vuetify/lib/components';
import { createSlots, translate } from '../utils';


export default {
  functional: true,
  render(createElement, context) {
    const slugRule = (x) => !x || x === slugify(x) || translate(context.parent.$vuetify, 'wrongFormat', 'Wrong format');

    const { data } = context;
    return createElement(VTextField, {
      ...data,
      props: {
        ...data.props || {},
        rules: [...data.props.rules || [], slugRule],
      },
    }, [
      ...createSlots(createElement, context.slots()),
      createElement(VTooltip, {
        props: { bottom: true },
        slot: 'append',
        scopedSlots: {
          activator: ({ on }) => createElement(VBtn, {
            props: { icon: true, xSmall: true },
            on: {
              ...on,
              click: () => {
                const newVal = slugify(data.props.item[data.props.basedOn || 'name']).toLowerCase();

                if (data.on.change) { data.on.change(newVal); }
                if (data.on.input) { data.on.input(newVal); }
              },
            },
          }, [createElement(VIcon, { large: true }, 'mdi-reply-outline')]),
        },
      }, translate(context.parent.$vuetify, 'generate', 'Generate')),
    ]);
  },
};
</script>
