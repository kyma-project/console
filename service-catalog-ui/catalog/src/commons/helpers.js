import { randomNamesGenerator } from '@kyma-project/react-components';
import builder from './builder';

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
/* eslint-disable no-unused-vars*/
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
/* eslint-enable no-unused-vars */
export function randomNameGenerator() {
  return randomNamesGenerator();
}

export function isStringValueEqualToTrue(value) {
  return value ? 'true' === value.toLowerCase() : false;
}

export const backendModuleExists = name => {
  const backendModules = builder.getBackendModules();
  if (!(backendModules && backendModules.length)) {
    return false;
  }

  return backendModules.includes(name);
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
    const assetsRegexp = /(?=]\()]\(\s*(\.\/)?assets/g;
    const assetRegexSrc = /src=("|')assets\/(.*?)("|')/g;
    let docsUrl = null;
    this.docs.map(doc => {
      docsUrl = doc.url.substring(0, doc.url.lastIndexOf('/'));
      // for markdown links
      if (doc.source.search(assetsRegexp) !== -1) {
        doc.source = doc.source.replace(assetsRegexp, `](${docsUrl}/assets`);
      }
      // for html links
      doc.source = doc.source.replace(assetRegexSrc, occurrence => {
        assetRegexSrc.lastIndex = 0;
        let href = assetRegexSrc.exec(occurrence);

        if (!href || !href[2]) return occurrence;
        return `src="${docsUrl}/assets/${href[2]}"`;
      });
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
