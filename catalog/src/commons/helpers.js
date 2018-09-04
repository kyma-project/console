export const sortDocumentsByType = documents => {
  if (!documents) return null;

  const docs = documents.docs || documents.Docs || null;

  if (documents && docs) {
    return docs.reduce((object, document) => {
      const key = document.type ? 'type' : 'Type';
      const val = document[key];

      if (!object[val]) {
        object[val] = [];
      }

      object[val].push(document);
      return object;
    }, {});
  }

  return null;
};

export const getDocumentsTypes = (items, docsSortedByType) => {
  let documentsTypes = [];
  if (items) {
    if (docsSortedByType) documentsTypes = Object.keys(docsSortedByType);
    if (items.apiSpec) documentsTypes.push('Console');
    if (items.asyncApiSpec) documentsTypes.push('Events');
  }

  return documentsTypes;
};

export const getResourceDisplayName = resource => {
  if (!resource) {
    return null;
  }

  return resource.displayName || resource.externalName || resource.name;
};

export const getDescription = resource => {
  if (!resource) {
    return null;
  }

  return resource.longDescription || resource.description;
};

export function clearEmptyPropertiesInObject(object) {
  for (const key in object) {
    if (typeof object[key] === 'undefined' || object[key] === '') {
      delete object[key];
      continue;
    }

    if (!object[key] || typeof object[key] !== 'object') {
      continue;
    }

    clearEmptyPropertiesInObject(object[key]);
    if (Object.keys(object[key]).length === 0) {
      delete object[key];
    }
  }
}

export function compareTwoObjects(obj1, obj2) {
  for (const p in obj1) {
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

    if (obj1[p] === null && obj2[p] !== null) return false;
    if (obj2[p] === null && obj1[p] !== null) return false;

    switch (typeof obj1[p]) {
      case 'object':
        if (!compareTwoObjects(obj1[p], obj2[p])) return false;
        break;
      case 'function':
        if (
          typeof obj2[p] === 'undefined' ||
          (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())
        )
          return false;
        break;
      default:
        if (obj1[p] === '' && obj2[p] !== '') return false;
        if (obj2[p] === '' && obj1[p] !== '') return false;
        if (obj1[p] !== obj2[p]) return false;
    }
  }

  for (const p in obj2) {
    if (typeof obj1[p] === 'undefined') return false;
  }
  return true;
}
