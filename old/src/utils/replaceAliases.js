import propsAliases from '../fields/propsAliases'

export default (props) => {
  const aliases = Object.keys(propsAliases)
  aliases.forEach((alias) => {
    if (props[alias] !== undefined) {
      propsAliases[alias](props, props[alias])
    }
  })

  return props
}
