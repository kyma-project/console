import { CREDENTIAL_TYPE_OAUTH } from 'components/Api/Forms/CredentialForms/OAuthCredentialsForm';

import jsyaml from 'js-yaml';
import xmlJS from 'xml-js';

function isYAML(file) {
  return file.name.endsWith('.yaml') || file.name.endsWith('.yml');
}

function isJSON(file) {
  return file.name.endsWith('.json');
}

function isXML(file) {
  return file.name.endsWith('.xml');
}

function parseXML(textData) {
  const parsed = xmlJS.xml2js(textData, { compact: true });
  // xmlJS returns empty object if parsing failed
  if (!Object.keys(parsed).length) {
    return null;
  }
  return parsed;
}

export function createApiData(basicApiData, specData, credentials) {
  const { name, description, group, targetUrl: targetURL, type } = basicApiData;

  let defaultAuth = null;
  if (credentials.type === CREDENTIAL_TYPE_OAUTH) {
    defaultAuth = {
      credential: {
        oauth: credentials.oAuth,
      },
    };
  }

  let spec = null;
  if (!specData.data) {
    spec = {
      ...specData,
      type,
    };
  }

  return {
    name,
    description,
    group,
    targetURL,
    spec,
    defaultAuth,
  };
}

export function createEventAPIData(basicApiData, specData) {
  const spec = specData
    ? {
        ...specData,
        eventSpecType: 'ASYNC_API',
      }
    : null;
  return {
    ...basicApiData,
    spec,
  };
}

export function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsText(file);
  });
}

export function getApiFormat(file) {
  if (isYAML(file)) {
    return 'YAML';
  } else if (isJSON(file)) {
    return 'JSON';
  } else if (isXML(file)) {
    return 'XML';
  } else {
    return null;
  }
}

export function getEventApiFormat(file) {
  if (isYAML(file)) {
    return 'YAML';
  } else if (isJSON(file)) {
    return 'JSON';
  } else {
    return null;
  }
}

export function parseApi(textData) {
  const parsers = {
    JSON: JSON.parse,
    XML: parseXML,
    YAML: jsyaml.safeLoad,
  };

  const errors = [];
  /* eslint-disable no-unused-vars */
  for (const format of Object.keys(parsers)) {
    try {
      return {
        data: parsers[format](textData) || {},
        format,
      };
    } catch (e) {
      errors.push(e);
      // move on to the next parser
    }
  }
  /* eslint-enable no-unused-vars */

  // warn only if no parser succeeded
  errors.forEach(console.warn);

  return null;
}

export function parseEventApi(textData) {
  try {
    const data = jsyaml.safeLoad(textData) || {};
    const format = textData.trim()[0] === '{' ? 'JSON' : 'YAML';
    return { data, format };
  } catch (e) {
    console.warn(e);
    return null;
  }
}

export function isAsyncApi(spec) {
  // according to https://www.asyncapi.com/docs/specifications/1.2.0/#a-name-a2sobject-a-asyncapi-object
  return !!spec.asyncapi;
}

export function isOpenApi(spec) {
  // according to https://swagger.io/specification/#fixed-fields
  return !!spec.openapi;
}

function isOData(spec) {
  // OData should be in EDMX format
  return !!spec['edmx:Edmx'];
}

export async function verifyEventApiFile(file) {
  const fileFormat = getEventApiFormat(file);
  if (fileFormat === null) {
    return { error: 'Error: Invalid file type' };
  }

  const data = await readFile(file);
  const parseResult = parseEventApi(data);

  if (!parseResult) {
    return { error: 'Spec file is invalid' };
  }

  if (fileFormat !== parseResult.format) {
    return { error: 'File type and content mismatch' };
  }

  if (!isAsyncApi(parseResult.data)) {
    return {
      error: 'Supplied spec does not have required "asyncapi" property',
    };
  }

  return { error: null, ...parseResult };
}

export async function verifyApiFile(file, expectedType) {
  const fileFormat = getApiFormat(file);
  if (fileFormat === null) {
    return { error: 'Error: Invalid file type' };
  }

  const data = await readFile(file);
  const parseResult = parseApi(data);

  if (!parseResult) {
    return { error: 'Spec file is invalid' };
  }

  if (fileFormat !== parseResult.format) {
    return { error: 'File type and content mismatch' };
  }

  if (!isOpenApi(fileFormat.data) && expectedType === 'OPEN_API') {
    return {
      error: 'Supplied spec does not have required "openapi" property',
    };
  }
  if (!isOData(fileFormat.data) && expectedType === 'ODATA') {
    return {
      error: 'Supplied spec does not have required "edmx:Edmx" property',
    };
  }

  return { error: null, ...parseResult };
}
