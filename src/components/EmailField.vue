<script>
import { VTextField } from 'vuetify/lib/components';
import EmailValidator from 'email-validator';
import { createSlots, translate } from '../utils';


export default {
  functional: true,
  render(createElement, context) {
    const { data } = context;
    return createElement(VTextField, {
      ...data,
      props: {
        ...data.props || {},
        type: data.props.inputType || 'email',
        rules: [
          ...data.props.rules || [],
          (x) => !x || EmailValidator.validate(x) || translate(context.parent.$vuetify, 'wrongFormat', 'Wrong format'),
        ],
      },
      attrs: {
        autocomplete: data.props.autocomplete || 'nope',
      }
    }, createSlots(createElement, context.slots()));
  },
};
</script>
