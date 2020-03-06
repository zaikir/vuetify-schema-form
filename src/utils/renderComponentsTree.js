export default (h, tree, item, emitInput, {
  context = {},
  scopedSlots = {},
  slots = {},
  ...options
} = {}) => {
  const { propsResolver } = options;
  function renderNode(node) {
    if (typeof node === 'string') return node;

    const {
      component, props = {}, class: _class, style, children = [], postProcess,
      postProcessProps = ({ props: _props }) => ({ props: _props }),
      methods = [],
    } = node;

    const totalContext = { item, ...context };
    const totalProps = Object.assign({}, ...Object.entries(props)
      .filter(([key]) => !key.startsWith('@') && !key.startsWith('$'))
      .map(([key, value]) => {
        if (key === 'value') {
          return { value: item[value] };
        }

        const resolver = propsResolver[key];

        const actualValue = typeof value === 'function' && !methods.includes(key)
          ? value(totalContext)
          : value;

        return resolver
          ? { ...resolver(actualValue, props) }
          : ({ [key]: actualValue });
      }));

    const renderedChildren = children.map((child) => renderNode(child));
    if (totalProps.if === false || (renderedChildren.length && !renderedChildren.some((x) => !!x))) {
      return null;
    }

    const events = Object.keys(props).filter((prop) => prop.startsWith('@'));
    return props.value && scopedSlots[`field.${props.value}`]
      ? scopedSlots[`field.${props.value}`](totalContext)
      : h(component, {
        ...postProcessProps({ props: totalProps, options, ...totalContext }),
        class: _class,
        style,
        on: {
          ...Object.assign({}, ...events.map((event) => ({
            [`${event.replace('@', '')}`]: props[event],
          }))),
          ...props.value !== undefined && {
            change(event) {
              if (event !== undefined && (!event || !event.target)) {
                // eslint-disable-next-line no-param-reassign
                item[props.value] = postProcess ? postProcess(event) : event;
                emitInput(item);
              }
            },
          },
        },
      }, [
        slots[`field.${props.value}`] && slots[`field.${props.value}`].map((func) => func()),
        ...renderedChildren,
      ]);
  }

  return renderNode(tree);
};
