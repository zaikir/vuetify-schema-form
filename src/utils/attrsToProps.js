export default (data) => {
  const { attrs } = data
  return {
    ...data,
    props: attrs,
    attrs: undefined
  }
}
