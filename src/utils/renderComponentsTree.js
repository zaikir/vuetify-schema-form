export default (h, tree) => {
  function renderNode(node) {
    const {
      component, props, class: _class, style, children,
    } = node;

    return h(component, {
      props,
      class: _class,
      style,
    }, children.map((child) => renderNode(child)));
  }

  return renderNode(tree);
};
