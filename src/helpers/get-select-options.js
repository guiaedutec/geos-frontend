import _ from "lodash";

export function getSelectOptions(data, field) {
  if (!data) return [];

  return data.map((d) => ({
    value: _.get(d, field),
    label: d.name,
    name: d.name,
  }));
}
