const filterEntry = (entry, query, searchProperties) => {
  if (!query) {
    return true;
  }

  if (typeof entry === 'string') {
    return (
      entry &&
      entry
        .toString()
        .toLowerCase()
        .indexOf(query.toLowerCase()) !== -1
    );
  }

  if (!Object.keys(searchProperties).length) {
    return false;
  }

  const flattenEntry = flattenProperties(entry);
  for (const property of searchProperties) {
    if (flattenEntry.hasOwnProperty(property)) {
      const value = flattenEntry[property];
      // apply to string to include numbers
      if (
        value &&
        value
          .toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
      ) {
        return true;
      }
    }
  }
  return false;
};

const flattenProperties = (obj, prefix = '') =>
  Object.keys(obj).reduce((properties, key) => {
    const value = obj[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (isPrimitive(value)) {
      properties[prefixedKey] = value && value.toString();
    } else if (Array.isArray(value)) {
      properties[prefixedKey] = JSON.stringify(value);
    } else {
      Object.assign(properties, flattenProperties(value, prefixedKey));
    }

    return properties;
  }, {});

const isPrimitive = type => {
  return (
    type === null || (typeof type !== 'function' && typeof type !== 'object')
  );
};

export const filterEntries = (entries, query, searchProperties) => {
  return entries.filter(entry => filterEntry(entry, query, searchProperties));
};
