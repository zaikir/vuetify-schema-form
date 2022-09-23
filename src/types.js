import {
  VRow, VCol, VTextField, VTextarea, VSheet, VTab, VTabItem, VIcon,
  VWindowItem,
} from 'vuetify/lib/components';
import {
  NumberField, IntegerField, PasswordField, PhoneField, EmailField,
  SelectField, AutocompleteField, SwitchField, CheckBoxField,
  RadioGroupField, DateField, DateTimeField, SlugField,
  HtmlField, HasuraFileField, HasuraFilesField, ApolloRemoteAutocomplete,
  ArrayField, MaskedInput, ComboboxField, BottomNavigation, TabsContainer,
  SearchField, TooltipTab, Subheader
} from './components';

export default {
  row: {
    component: VRow,
    childResolver: (child) => {
      const { props: childProps = {} } = child;
      const allProps = ['align-self', 'cols', 'lg', 'md', 'offset', 'offset-lg', 'offset-md', 'offset-sm', 'offset-xl', 'order', 'order-lg', 'order-md', 'order-sm', 'order-xl', 'sm', 'xl'];
      const keys = Object.keys(childProps).filter((key) => allProps.includes(key));
      const props = Object.assign({ cols: 12 }, ...keys.map((key) => ({ [key]: childProps[key] })));

      return !child
        ? []
        : [{
          component: VCol, type: 'col', props, children: [child],
        }];
    },
    postProcessProps: ({ props, item }) => ({ props: { ...props, item } }),
  },
  text: { 
    component: VTextField,
    postProcessProps: ({ props }) => ({ props, attrs: {
      ...props,
      autocomplete: props.autocomplete || 'nope'
     } })
  },
  search: { 
    component: SearchField,
  },
  mask: {
    component: MaskedInput,
    postProcessProps: ({ props }) => ({ props, attrs: props }),
  },
  subheader: {
    component: Subheader,
    postProcessProps: ({ props }) => ({ props, attrs: props }),
  },
  sheet: { component: VSheet },
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
  combobox: { component: ComboboxField },
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
    methods: ['onResponse', 'onFetched'], // , 'filter'
    postProcessProps: ({ props }) => ({ props, attrs: props }),
  },
  array: {
    component: ArrayField,
    postProcessProps: ({ props, options }) => ({ props: { ...props, $options: options } }),
  },
  tabs: {
    component: TabsContainer,
    postProcessProps: ({ props }) => ({ props, attrs: props }),
    childResolver: (child) => {
      const { props = {} } = child;
      const key = props.key || `${props.label}_${props.icon}`;
      const { tab = { class: 'pt-3' } } = props;

      return [
        {
          component: TooltipTab,
          props: { key, ...props },
          children: [
            props.icon && { component: VIcon, class: { 'mr-2': true }, children: [props.icon] },
            props.label,
          ].filter((x) => !!x),
        },
        {
          component: VTabItem,
          ...tab,
          props: { key, ...tab.props },
          children: [child],
        }];
    },
  },
  bottomTabs: {
    component: BottomNavigation,
    postProcessProps: ({ props }, { renderedChildren, children }) => ({
      props: {
        ...props,
        tabs: renderedChildren.map((x, i) => !!x && children[i].children[0].props).filter((x) => !!x),
      },
    }),
    childResolver: (child) => {
      const { props = {} } = child;
      const key = props.key || `${props.label}_${props.icon}`;
      const { tab = { class: 'pt-3' } } = props;

      return [{
        component: VWindowItem,
        ...tab,
        props: { key, ...tab.props },
        children: [child],
      }];
    },
  },
};
