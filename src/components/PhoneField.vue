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
          blocks: data.props.countryCodeLead ? [1, 0, 3, 0, 3, 4] : [0, 3, 0, 3, 4],
          delimiters: data.props.countryCodeLead ? [' ', '(', ')', ' ', '-'] : ['(', ')', ' ', '-'],
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
    }, createSlots(createElement, context.slots()));
  },
};
</script>
