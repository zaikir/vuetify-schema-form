import defaultPropsResolver from '../defaultPropsResolver';

export default (h, tree, item, context = {}, emitInput, scopedSlots, {
  propsResolver = defaultPropsResolver,
} = {}) => {
  function renderNode(node) {
    const {
      component, props, class: _class, style, children,
    } = node;

    const totalContext = { item, ...context };
    return props.value && scopedSlots[`field.${props.value}`]
      ? scopedSlots[`field.${props.value}`](totalContext)
      : h(component, {
        props: Object.assign({}, ...Object.entries(props)
          .map(([key, value]) => {
            if (key === 'value') {
              return { value: item[value] };
            }

            const resolver = propsResolver[key];
            const actualValue = typeof value === 'function' ? value(totalContext) : value;

            return resolver
              ? { ...resolver(actualValue, props) }
              : ({ [key]: actualValue });
          })),
        class: _class,
        style,
        ...props.value && {
          on: {
            change(event) {
              if (event !== undefined && (!event || !event.target)) {
                emitInput({ ...item, [props.value]: event });
              }
            },
          },
        },
      }, children.map((child) => renderNode(child)));
  }

  return renderNode(tree);
};
