export default (root, {
  types,
  defaultType,
  globalProps,
  globalClasses,
} = {}) => {
  function buildNode(element, parentChildResolver = (x) => [x]) {
    const {
      type = defaultType, class: _class = {}, style, fields = [], ...props
    } = element;

    // if (types[type]) {
    //   throw new Error(`Component "${type}" is not defined!`);
    // }

    const { component, childResolver, ...rest } = types[type] || {
      component: 'type',
    };

    return parentChildResolver({
      component,
      type,
      props: { ...globalProps, ...props },
      class: { ...globalClasses, ..._class },
      style,
      children: [].concat(...fields.map((field) => buildNode(field, childResolver))),
      ...rest,
    });
  }

  return buildNode(root)[0];
};
