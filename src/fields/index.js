import {
  ColumnContainer, RowContainer, TextField,
  EmailField, PasswordField, SelectField, AutocompleteField,
  SwitchField, CheckBoxField, IntegerField, NumberField,
  RadioGroupField, TextareaField, PhoneField, DateField,
  DateTimeField, ApolloRemoteAutocomplete, HtmlField
} from '../components'

export default {
  row: RowContainer,
  col: ColumnContainer,

  text: TextField,
  html: HtmlField,
  textArea: TextareaField,
  email: EmailField,
  phone: PhoneField,
  password: PasswordField,
  int: IntegerField,
  number: NumberField,

  date: DateField,
  datetime: DateTimeField,

  select: SelectField,
  autocomplete: AutocompleteField,
  remote: ApolloRemoteAutocomplete,

  switch: SwitchField,
  bool: CheckBoxField,
  radio: RadioGroupField
}
