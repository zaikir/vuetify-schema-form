<script>
import clone from 'clone';
import { VRow, VCol, VTextField } from 'vuetify/lib/components';

const types = {
  text: {
    component: VTextField,
  },
  row: {
    component: VRow,
    childrenResolver: (child, h) => {
      const props = ['align-self', 'cols', 'lg', 'md', 'offset', 'offset-lg', 'offset-md', 'offset-sm', 'offset-xl', 'order', 'order-lg', 'order-md', 'order-sm', 'order-xl', 'sm', 'xl'];
      const keys = Object.keys(child).filter((key) => props.includes(key));

      return h(VCol, {
        props: Object.assign({ cols: 12 }, ...keys.map((key) => ({ [key]: child[key] }))),
      });
    },
  },
};

export default {
  name: 'VuetifySchemaForm',
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    fields: {
      type: Object,
      default: null,
    },
    context: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      clone: {},
    };
  },
  watch: {
    value: {
      handler(val) {
        this.clone = clone(val);
      },
      immediate: true,
    },
  },
  methods: {
    submit() {
      if (!this.$refs.editForm.validate()) {
        return;
      }

      this.$emit('submit', this.clone);
    },
    reset() {
      if (this.$refs.editForm) {
        this.clone = {};
        this.$refs.editForm.resetValidation();
      }
    },
  },
  render(h) {

  },
};

/*
 library API v1.0
  old =[
    { label: 'Название', value: 'name', required: true, md: 6, lg: 4 },
    { label: 'Slug', value: 'slug', type: 'slug', basedOn: 'name', required: true, md: 6, lg: 4 },
    { label: 'Сортировка', value: 'sort', required: true, type: 'int', md: 6, lg: 4 },
    { label: 'Стоимость', value: 'price', required: true, type: 'int', md: 6, lg: 4, suffix: '₽' },
    { label: 'Акционная стоимость', value: 'discountPrice', type: 'int', md: 6, lg: 4, suffix: '₽' },
    { label: 'Участвует в акции', value: 'withDiscount', type: 'bool', md: 6, lg: 4 },
    { label: 'Категории',
      value: 'categories',
      type: 'remote',
      multiple: true,
      query: 'Category (where: {isRemoved: {_neq: true}}) { id name }',
      itemText: 'name',
      itemValue: 'id',
      required: true,
      outlined: true
    },
    { label: 'Изображения', value: 'images', type: 'files' },
    { label: 'Описание (для SEO)', value: 'description', type: 'textArea', outlined: true, required: true },
    { label: 'Описание', value: 'content', type: 'html', outlined: true, required: true }
  ]

  Цели: однозначно преобразовать JSON-описание в node-tree
  {
    type: 'row',
    props: {},
    children: [
      { props: { label: 'Название', value: 'name', required: true, md: 6, lg: 4 } },
    ]
  }
 */
</script>
