<script>
import MaskedInput from './MaskedInput.vue';
import { createSlots } from '../utils';

export default {
  functional: true,
  render(createElement, context) {
    const { data } = context;
    return createElement(MaskedInput, {
      ...data,
      props: {
        value: data.props.value,
        mask: {
          numericOnly: true,
          blocks: [0, 3, 0, 3, 4],
          delimiters: ['(', ')', ' ', '-'],
        },
      },
      attrs: {
        prefix: '+7',
        placeholder: '(###) ###-##-##',
        ...data.props || {},
        type: 'tel',
        rules: [
          ...data.props.rules || [],
        ],
      },
    }, contextcreateSlots(createElement, context.slots()));
  },
};
</script>
