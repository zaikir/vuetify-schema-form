import Form from './Form.vue';
import Types from './types';
import PropsResolver from './propsResolver';

export const SchemaForm = Form;
export const types = Types;
export const propsResolver = PropsResolver;

export default {
  install: (Vue, options = {}) => {
    // eslint-disable-next-line no-param-reassign
    Vue.$schemaForm = options;
  },
};
