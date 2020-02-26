import defaultPropsResolver from '../defaultPropsResolver';

export default (h, tree, item, emitInput, {
  propsResolver = defaultPropsResolver,
} = {}) => {
  function renderNode(node) {
    const {
      component, props, class: _class, style, children,
    } = node;

    return h(component, {
      props: Object.assign({}, ...Object.entries(props)
        .map(([key, value]) => {
          if (key === 'value') {
            return { value: item[value] };
          }

          const resolver = propsResolver[key];
          const actualValue = typeof value === 'function'
            ? value({ item })
            : value;

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
