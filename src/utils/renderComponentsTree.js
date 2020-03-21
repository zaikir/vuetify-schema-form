import { VSkeletonLoader } from 'vuetify/lib/components';

export default (h, tree, item, emitInput, {
  context = {},
  scopedSlots = {},
  // slots = {},
  ...options
} = {}) => {
  const { propsResolver, skeletonLoading } = options;
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
          ? { ...resolver(actualValue, props, options) }
          : ({ [key]: actualValue });
      }));

    const renderedChildren = children.map((child) => renderNode(child));
    if (totalProps.if === false || (renderedChildren.length && !renderedChildren.some((x) => !!x))) {
      return null;
    }

    const slotPrefix = `field.${props.value}`;
    const events = Object.keys(props).filter((prop) => prop.startsWith('@'));

    // const totalScopedSlots = Object.fromEntries(Object.entries(scopedSlots)
    //   .filter(([key,value]) => key.startsWith(`${slotPrefix}.`))
    //   .map(([key,value]) => [key.replace(`${slotPrefix}.`, ''), value]))

    const slots = Object.entries(scopedSlots)
      .filter(([key]) => key.startsWith(`${slotPrefix}.`))
      .map(([key, value]) => [key.replace(`${slotPrefix}.`, ''), h('template', { slot: key.replace(`${slotPrefix}.`, '') }, value())]);

    if (props.value && skeletonLoading && props.skeleton !== false) {
      return h(VSkeletonLoader, {
        props: {
          loading: skeletonLoading, type: 'text', width: '80%', height: '44px', ...props.skeleton,
        },
        class: 'vsf-skeleton-loading',
      });
    }

    return props.value && scopedSlots[slotPrefix]
      ? scopedSlots[slotPrefix](totalContext)
      : h(component, {
        ...postProcessProps({ props: totalProps, options, ...totalContext }),
        class: _class,
        style,
        on: {
          ...Object.assign({}, ...events.map((event) => ({
            [`${event.replace('@', '')}`]: (eventArgs) => props[event]({ ...totalContext, eventArgs }),
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
        scopedSlots,
      }, [
        ...renderedChildren,
        ...slots,
      ]);
  }

  return renderNode(tree);
};
