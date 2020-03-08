export default (createElement, slots) => Object.entries(slots).map(
  ([slot, value]) => createElement('template', { slot }, value),
);
