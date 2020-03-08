export default ($vuetify, key, defaultTranslation) => {
  const translation = ($vuetify.lang.locales[$vuetify.lang.current].schemaForm || {})[key];
  return translation || defaultTranslation;
};
