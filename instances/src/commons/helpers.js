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
    if (svcClass.openApiSpec) documentsTypes.push('Console');
    if (svcClass.asyncApiSpec) documentsTypes.push('Events');
    if (svcClass.odataSpec) documentsTypes.push('OData');
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

export const backendModuleExists = name => {
  return builder.getBackendModules().includes(name);
};

export const processDocFilename = arg => {
  const value = arg.split('/');
  return value[value.length - 1].replace('.md', '');
};

export class DocsProcessor {
  constructor(docs = []) {
    // for rewrite readonly fields
    this.docs = JSON.parse(JSON.stringify([...docs]));
  }

  replaceImagePaths = () => {
    const assetsRegexp = /(\.\/)?assets/g;
    let docsUrl = null;
    this.docs.map(doc => {
      docsUrl = doc.url.substring(0, doc.url.lastIndexOf('/'));
      if (doc.source.search(assetsRegexp) !== -1) {
        doc.source = doc.source.replace(assetsRegexp, `${docsUrl}/assets`);
      }
      return doc;
    });

    return this;
  };

  removeMatadata = () => {
    const metadataRegexp = '---';
    let docsBeginingIndex = null;

    this.docs.map(doc => {
      docsBeginingIndex = doc.source.indexOf(metadataRegexp, 3) + 3;
      doc.source = doc.source.substring(docsBeginingIndex, doc.source.length);
      return doc;
    });

    return this;
  };

  result() {
    return this.docs;
  }
}
