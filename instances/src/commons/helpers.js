import builder from './builder';

export const sortDocumentsByType = documents => {
  if (!documents) return null;

  const docs = documents.docs || documents.Docs || null;

  if (documents && docs) {
    return docs.reduce((obj, document) => {
      const key = document.type ? 'type' : 'Type';
      const val = document[key];

      if (!val) return {};

      if (!obj[val]) {
        obj[val] = [];
      }
      obj[val].push(document);
      return obj;
    }, {});
  }
  return null;
};

export const getDocumentsTypes = (svcClass, docsSortedByType = {}) => {
  let documentsTypes = [];
  if (svcClass) {
    if (docsSortedByType) documentsTypes = Object.keys(docsSortedByType);
    if (svcClass.apiSpec) documentsTypes.push('Console');
    if (svcClass.asyncApiSpec) documentsTypes.push('Events');
  }
  return documentsTypes;
};

export const getResourceDisplayName = resource => {
  if (!resource) {
    return null;
  }

  return resource.displayName || resource.externalName || resource.name;
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

export const statusColor = statusType => {
  switch (statusType) {
    case 'PROVISIONING':
    case 'DEPROVISIONING':
    case 'PENDING':
      return '#ffb600';
    case 'FAILED':
      return '#ee0000';
    case 'RUNNING':
    case 'READY':
      return '#3db350';
    default:
      return '#ffb600';
  }
};

export const validateContent = content => {
  if (!content) return false;

  let documentsByType = [],
    documentsTypes = [];

  if (content && Object.keys(content).length) {
    documentsByType = sortDocumentsByType(content);
    if (!documentsByType) return false;
    documentsTypes = Object.keys(documentsByType);
    if (!documentsTypes) return false;
  }

  let numberOfSources = 0;
  documentsTypes.forEach(type => {
    const docsType = documentsByType[type];
    for (let item = 0; item < docsType.length; item++) {
      if (docsType[item].source || docsType[item].Source) numberOfSources++;
    }
  });
  return numberOfSources > 0;
};

export const backendModuleExists = (name) => {
  return builder.getBackendModules().includes(name);
}