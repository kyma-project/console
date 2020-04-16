export function omitTypenames(item) {
  const omitTypename = (key, value) =>
    key === '__typename' ? undefined : value;
  return JSON.parse(JSON.stringify(item), omitTypename);
}
