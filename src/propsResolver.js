import { translate } from './utils';

export default {
  required: (value, props = {}, { $vuetify }) => ({
    required: value,
    ...value && {
      rules: [
        ...props.rules || [],
        (x) => !!x || translate($vuetify, 'requiredRule', 'Value required'),
      ],
    },
  }),
};
