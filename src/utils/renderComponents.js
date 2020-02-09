function buildElement (createElement, node, model, {
  globalProps = {}, globalClasses = {}, onInput, onChange
}) {
  const children = node.children && node.children.map(x => buildElement(createElement, x, model, {
    globalProps,
    globalClasses,
    onInput,
    onChange
  }))

  const props = {
    ...globalProps,
    ...node.params.props,
    ...node.params.__bindToModel && { value: model[node.params.__value] }
  }

  return createElement(node.component, {
    ...node.params,
    props,
    attrs: props,
    class: {
      ...node.params.class,
      ...globalClasses
    },
    on: {
      ...node.params.on,
      ...onInput && {
        input (event) {
          if (event !== undefined && (!event || !event.target)) {
            model[node.params.__value] = event
            onInput()
          }
        }
      },
      ...onChange && {
        change (event) {
          if (event !== undefined && (!event || !event.target)) {
            model[node.params.__value] = event
            onChange()
          }
        }
      }
    }
  }, children)
}

export default buildElement
