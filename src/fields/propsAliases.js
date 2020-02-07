export default {
  required: (obj, value) => {
    if (value) {
      const rules = obj.rules || []
      rules.push(x => !!x || 'Введите значение') // To do: add localization support

      obj.rules = rules
    }
  }
}
