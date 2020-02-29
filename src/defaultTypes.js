import {
  VRow, VCol, VTextField, VTextarea,
} from 'vuetify/lib/components';
import {
  NumberField, IntegerField, PasswordField, PhoneField, EmailField,
  SelectField, AutocompleteField, SwitchField, CheckBoxField,
  RadioGroupField, DateField, DateTimeField, SlugField,
  HtmlField, HasuraFileField, HasuraFilesField, ApolloRemoteAutocomplete,
  ArrayField,
} from './components';

export default {
  row: {
    component: VRow,
    childResolver: (child) => {
      const { props: childProps = {} } = child;
      const allProps = ['align-self', 'cols', 'lg', 'md', 'offset', 'offset-lg', 'offset-md', 'offset-sm', 'offset-xl', 'order', 'order-lg', 'order-md', 'order-sm', 'order-xl', 'sm', 'xl'];
      const keys = Object.keys(childProps).filter((key) => allProps.includes(key));
      const props = Object.assign({ cols: 12 }, ...keys.map((key) => ({ [key]: childProps[key] })));

      return {
        component: VCol, type: 'col', props, children: [child],
      };
    },
    postProcessProps: ({ props, item }) => ({ props: { ...props, item } }),
  },
  text: { component: VTextField },
  textArea: { component: VTextarea },
  number: { component: NumberField, postProcess: (val) => parseFloat(val) },
  int: { component: IntegerField, postProcess: (val) => parseInt(val, 10) },
  password: { component: PasswordField },
  phone: {
    component: PhoneField,
    postProcessProps: ({ props }) => ({ props, attrs: props }),
  },
  email: { component: EmailField },
  select: { component: SelectField },
  autocomplete: { component: AutocompleteField },
  switch: { component: SwitchField },
  checkbox: { component: CheckBoxField },
  radio: { component: RadioGroupField },
  date: { component: DateField, postProcessProps: ({ props }) => ({ props, attrs: props }) },
  datetime: {
    component: DateTimeField, postProcessProps: ({ props }) => ({ props, attrs: props }),
  },
  slug: {
    component: SlugField,
    postProcessProps: ({ props, item }) => ({ props: { ...props, item } }),
  },
  html: { component: HtmlField },
  file: { component: HasuraFileField },
  files: { component: HasuraFilesField },
  remote: {
    component: ApolloRemoteAutocomplete,
    methods: ['onResponse'],
  },
  array: { component: ArrayField },
};
