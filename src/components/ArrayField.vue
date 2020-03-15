<script>
import { buildComponentsTree, renderComponentsTree } from '../utils';

export default {
  functional: true,
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    containerProps: {
      type: Object,
      default: () => ({
        noGutters: true,
      }),
    },
    inputType: {
      type: String,
      default: 'text',
    },
  },
  render(h, context) {
    const { data } = context;

    const emit = (newVal) => {
      if (data.on.change) { data.on.change(newVal); }
      if (data.on.input) { data.on.input(newVal); }
    };

    const items = data.props.value && data.props.value.length ? data.props.value : [null];
    const root = {
      type: 'row',
      ...data.props.containerProps,
      fields: items.map((item, i) => ({
        ...data.props,
        ...data.props.inputProps || {},
        type: data.props.inputType,
        value: i.toString(),
        appendOuterIcon: i === 0 ? 'add' : 'remove',
        label: i !== 0 ? `${data.props.label || ''} #${i + 1}` : `${data.props.label || ''}`,
        '@click:append-outer': () => {
          if (i === 0) {
            emit([...items, null]);
          } else {
            emit(items.filter((x, id) => i !== id));
          }
        },
      })),
    };

    const model = Object.assign({}, ...items.map((x, i) => ({ [i]: x })));

    const tree = buildComponentsTree(root, data.props.$options);
    const renderedTree = renderComponentsTree(h, tree, model, (val) => { emit(Object.values(val)); }, {
      context: data.props.context,
      ...data.props.$options,
    });

    return renderedTree;
  },
};
</script>
