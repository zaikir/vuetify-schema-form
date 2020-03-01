export default (h, tree, item, emitInput, {
  context = {},
  scopedSlots = {},
  slots = {},
  propsResolver,
} = {}) => {
  function renderNode(node) {
    const {
      component, props, class: _class, style, children, postProcess,
      postProcessProps = ({ props: _props }) => ({ props: _props }),
      methods = [],
    } = node;

    const totalContext = { item, ...context };
    const totalProps = Object.assign({}, ...Object.entries(props)
      .filter(([key]) => !key.startsWith('@'))
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

    const events = Object.keys(props).filter((prop) => prop.startsWith('@'));
    return props.value && scopedSlots[`field.${props.value}`]
      ? scopedSlots[`field.${props.value}`](totalContext)
      : h(component, {
        ...postProcessProps({ props: totalProps, ...totalContext }),
        class: _class,
        style,
        on: {
          ...Object.assign({}, ...events.map((event) => ({
            [`${event.replace('@', '')}`]: props[event],
          }))),
          ...props.value !== undefined && {
            change(event) {
              if (event !== undefined && (!event || !event.target)) {
                emitInput({
                  ...item,
                  [props.value]: postProcess ? postProcess(event) : event,
                });
              }
            },
          },
        },
      }, [
        slots[`field.${props.value}`] && slots[`field.${props.value}`].map((func) => func()),
        ...children.map((child) => renderNode(child)),
      ]);
  }

  return renderNode(tree);
};
