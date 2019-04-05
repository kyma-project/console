import builder from './builder';
import { adjectives, nouns } from './random-names-data';

export const sortDocumentsByType = documents => {
  if (!documents) return null;

  const docs = documents.docs || documents.Docs || null;

  if (documents && docs) {
    return docs.reduce((object, document) => {
      const key = document.type ? 'type' : 'Type';
      const val = document[key];

      if (!val) return {};

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
    if (items.openApiSpec) documentsTypes.push('Console');
    if (items.asyncApiSpec) documentsTypes.push('Events');
    if (items.odataSpec) documentsTypes.push('OData');
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

export function randomNameGenerator() {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  return (
    adjectives[getRandomInt(0, adjectives.length + 1)] +
    '-' +
    nouns[getRandomInt(0, nouns.length + 1)]
  ).toLowerCase();
}

export function isStringValueEqualToTrue(value) {
  return value ? 'true' === value.toLowerCase() : false;
}

export const backendModuleExists = name => {
  return builder.getBackendModules().includes(name);
};
