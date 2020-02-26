import defaultPropsResolver from '../defaultPropsResolver';

export default (h, tree, {
  propsResolver = defaultPropsResolver,
} = {}) => {
  function renderNode(node) {
    const {
      component, props, class: _class, style, children,
    } = node;

    return h(component, {
      props: Object.assign({}, ...Object.entries(props)
        .filter(([key]) => key !== 'value')
        .map(([key, value]) => {
          const resolver = propsResolver[key];
          const actualValue = value; // ToDo: add function resolver

          return resolver
            ? { ...resolver(actualValue, props) }
            : ({ [key]: actualValue });
        })),
      class: _class,
      style,
    }, children.map((child) => renderNode(child)));
  }

  return renderNode(tree);
};
