const filterEntry = (entry, query, searchProperties) => {
  if (!query) {
    return true;
  }

  if (!Object.keys(searchProperties).length) {
    return false;
  }
  for (const property of searchProperties) {
    if (entry.hasOwnProperty(property)) {
      const value = entry[property];
      // apply to string to include numbers
      if (value && value.toString().indexOf(query) !== -1) {
        return true;
      }
    }
  }
  return false;
};

export const filterEntries = (entries, query, searchProperties) => {
  return entries.filter(entry => filterEntry(entry, query, searchProperties));
};
