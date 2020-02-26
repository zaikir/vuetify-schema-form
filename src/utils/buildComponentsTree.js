import defaultTypes from '../defaultTypes';

export default (root, {
  types = defaultTypes,
  defaultType = 'text',
  defaultProps = {},
} = {}) => {
  function buildNode(element, parentChildResolver = (x) => x) {
    const {
      type = defaultType, class: _class, style, fields = [], ...props
    } = element;

    const { component, childResolver } = types[type];

    return parentChildResolver({
      component,
      type,
      props: {
        ...defaultProps,
        ...props,
      },
      class: _class,
      style,
      children: fields.map((field) => buildNode(field, childResolver)),
    });
  }

  return buildNode(root);
};
