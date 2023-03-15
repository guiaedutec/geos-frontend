export function omitFieldProperties(field) {
  const { value, onChange, checked, name, error, ...rest } = field;
  return { value: value || "", onChange, checked, name, error };
}
