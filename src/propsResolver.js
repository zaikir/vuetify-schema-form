
export default {
  required: (value, props = {}, { $vuetify }) => ({
    required: value,
    ...value && {
      rules: [
        ...props.rules || [],
        (x) => !!x || $vuetify.lang.t('$vuetify.schemaForm.requiredRule') || 'Введите значение',
      ],
    },
  }),
};
