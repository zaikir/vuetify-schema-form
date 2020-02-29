export default {
  required: (value, props = {}) => ({
    required: value,
    ...value && {
      rules: [
        ...props.rules || [],
        (x) => !!x || 'Введите значение', // ToDo: add localization support
      ],
    },
  }),
};
