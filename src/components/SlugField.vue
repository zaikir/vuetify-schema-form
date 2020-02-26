<script>
import slugify from 'slugify';
import {
  VTextField, VTooltip, VBtn, VIcon,
} from 'vuetify/lib/components';

export default {
  functional: true,
  render(createElement, context) {
    const slugRule = (x) => !x || x === slugify(x) || 'Неверный формат';// ToDo: localization

    const { data } = context;
    return createElement(VTextField, {
      ...data,
      props: {
        ...data.props || {},
        rules: [...data.props.rules || [], slugRule],
      },
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
                const newVal = slugify(data.props.item[data.props.basedOn || 'name']).toLowerCase();

                if (data.on.change) { data.on.change(newVal); }
                if (data.on.input) { data.on.input(newVal); }
              },
            },
          }, [createElement(VIcon, { large: true }, 'mdi-reply-outline')]),
        },
      }, 'Сгенерировать'), // ToDo: localization
    ]);
  },
};
</script>
