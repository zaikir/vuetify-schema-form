import defaultTypes from '../defaultTypes';

export default (root, {
  types = defaultTypes,
  defaultType = 'text',
  defaultProps = {},
  defaultClasses = {},
} = {}) => {
  function buildNode(element, parentChildResolver = (x) => x) {
    const {
      type = defaultType, class: _class, style, fields = [], ...props
    } = element;

    const { component, childResolver, ...rest } = types[type];

    return parentChildResolver({
      component,
      type,
      props: {
        ...defaultProps,
        ...props,
      },
      class: {
        _class,
        ...defaultClasses,
      },
      style,
      children: fields.map((field) => buildNode(field, childResolver)),
      ...rest,
    });
  }

  return buildNode(root);
};
