<script>
import { VTextField } from 'vuetify/lib/components';
import EmailValidator from 'email-validator';
import { createSlots } from '../utils';

export default {
  functional: true,
  render(createElement, context) {
    const { data } = context;
    return createElement(VTextField, {
      ...data,
      props: {
        ...data.props || {},
        rules: [
          ...data.props.rules || [],
          (x) => !x || EmailValidator.validate(x) || context.parent.$vuetify.lang.t('$vuetify.schemaForm.wrongFormat') || 'Неверный формат',
        ],
      },
    }, createSlots(context.slots()));
  },
};
</script>
