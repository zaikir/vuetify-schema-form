export default (root, {
  types,
  defaultType,
  globalProps,
  globalClasses,
} = {}) => {
  function buildNode(element, parentChildResolver = (x) => x) {
    const {
      type = defaultType, class: _class = {}, style, fields = [], ...props
    } = element;

    const { component, childResolver, ...rest } = types[type];

    return parentChildResolver({
      component,
      type,
      props: { ...globalProps, ...props },
      class: { ...globalClasses, ..._class },
      style,
      children: fields.map((field) => buildNode(field, childResolver)),
      ...rest,
    });
  }

  return buildNode(root);
};
