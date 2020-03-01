import Form from './Form.vue';

export default {
  install: (Vue, options = {}) => {
    // eslint-disable-next-line no-param-reassign
    Vue.$schemaForm = options;
  },
};

export const SchemaForm = Form;
