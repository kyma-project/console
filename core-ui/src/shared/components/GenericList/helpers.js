export const filterEntries = (entries, query) => {
  // TEMP
  if (
    entries[0] &&
    (entries[0].hasOwnProperty('name') ||
      entries[0].hasOwnProperty('description'))
  ) {
    return entries.filter(entry => {
      return (
        (entry.name && entry.name.indexOf(query) > -1) ||
        (entry.description && entry.description.indexOf(query) > -1)
      );
    });
  } else {
    return entries;
  }
};
