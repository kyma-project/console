export function searchForObject(input = {}, key = '') {
  if (!input) {
    return null;
  }
  if (input.hasOwnProperty(key)) {
    return input;
  }

  for (const nextInputObject of Object.values(input)) {
    if (typeof nextInputObject === 'object') {
      const o = searchForObject(nextInputObject, key);
      if (o !== null) {
        return o;
      }
    }
  }
  return null;
}
