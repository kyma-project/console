export function getActualChanges(original, toAdd, toRemove) {
  // add only non-present
  const actualToAdd = toAdd.filter(entry => !original.includes(entry));
  // remove only already existing
  const actualToRemove = original.filter(org => toRemove.includes(org));
  return [actualToAdd, actualToRemove];
}
