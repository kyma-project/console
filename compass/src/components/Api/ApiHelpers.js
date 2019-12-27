import jsyaml from 'js-yaml';
import xmlJS from 'xml-js';
import { CREDENTIAL_TYPE_NONE } from './Forms/CredentialForms/CredentialsForm';
import { CREDENTIAL_TYPE_OAUTH } from './Forms/CredentialForms/OAuthCredentialsForm';

function isYAML(file) {
  return file.name.endsWith('.yaml') || file.name.endsWith('.yml');
}

function isJSON(file) {
  return file.name.endsWith('.json');
}

function isXML(file) {
  return file.name.endsWith('.xml');
}

function isAsyncApi(spec) {
  // according to https://www.asyncapi.com/docs/specifications/1.2.0/#a-name-a2sobject-a-asyncapi-object
  return spec && !!spec.asyncapi;
}

function isOpenApi(spec) {
  // according to https://swagger.io/specification/#fixed-fields
  return spec && !!spec.openapi;
}

function isOData(spec) {
  // OData should be in EDMX format
  return spec && !!spec['edmx:Edmx'];
}

function parseXML(textData) {
  const parsed = xmlJS.xml2js(textData, { compact: true });
  // xmlJS returns empty object if parsing failed
  if (!Object.keys(parsed).length) {
    throw Error('Parse error');
  }
  return parsed;
}

export function createApiData(
  basicApiData,
  specData,
  credentials,
  credentialsType,
) {
  let defaultAuth = null;
  if (credentialsType === CREDENTIAL_TYPE_OAUTH) {
    defaultAuth = { credential: { oauth: credentials.oAuth } };
  }

  return {
    ...basicApiData,
    spec: specData,
    defaultAuth,
  };
}

export function createEventAPIData(basicApiData, specData) {
  const spec = specData
    ? {
        ...specData,
        type: 'ASYNC_API',
      }
    : null;

  return {
    ...basicApiData,
    spec,
  };
}

function parseForFormat(apiText, format) {
  const parsers = {
    JSON: JSON.parse,
    YAML: jsyaml.safeLoad,
    XML: parseXML,
  };

  try {
    return parsers[format](apiText);
  } catch (_) {
    return { error: 'Parse error' };
  }
}

export function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsText(file);
  });
}

export function checkApiFormat(file) {
  switch (true) {
    case isYAML(file):
      return 'YAML';
    case isJSON(file):
      return 'JSON';
    case isXML(file):
      return 'XML';
    default:
      return false;
  }
}

export function checkEventApiFormat(file) {
  switch (true) {
    case isYAML(file):
      return 'YAML';
    case isJSON(file):
      return 'JSON';
    default:
      return false;
  }
}

export async function verifyEventApiFile(file) {
  const format = checkEventApiFormat(file);
  if (format === null) {
    return { error: 'Error: Invalid file type' };
  }

  const data = await readFile(file);
  const spec = parseForFormat(data, format);

  if (!isAsyncApi(spec)) {
    return {
      error: 'Supplied spec does not have required "asyncapi" property',
    };
  }

  return { error: null, format, data };
}

export async function verifyApiFile(file, expectedType) {
  const format = checkApiFormat(file);
  console.log(format);
  if (format === null) {
    return { error: 'Error: Invalid file type' };
  }

  const data = await readFile(file);
  const spec = parseForFormat(data, format);

  if (!spec) {
    return { error: 'Parse error' };
  }

  if (!isOpenApi(spec) && expectedType === 'OPEN_API') {
    return {
      error: 'Supplied spec does not have required "openapi" property',
    };
  }
  if (!isOData(spec) && expectedType === 'ODATA') {
    return {
      error: 'Supplied spec does not have required "edmx:Edmx" property',
    };
  }

  return { error: null, format, data };
}

export function verifyApiInput(apiText, format, apiType) {
  const spec = parseForFormat(apiText, format);
  if (!spec) {
    return { error: 'Parse error' };
  }

  if (!isOpenApi(spec) && apiType === 'OPEN_API') {
    return { error: '"openapi" property is required' };
  }
  if (!isOData(spec) && apiType === 'ODATA') {
    return { error: '"edmx:Edmx" property is required' };
  }

  return { error: null };
}

export function verifyEventApiInput(eventApiText, format) {
  const spec = parseForFormat(eventApiText, format);
  if (!spec) {
    return { error: 'Parse error' };
  }

  if (!isAsyncApi(spec)) {
    return { error: '"asyncapi" property is required' };
  }

  return { error: null };
}

export function getApiType(api) {
  switch (api.spec && api.spec.type) {
    case 'OPEN_API':
      return 'openapi';
    case 'ODATA':
      return 'odata';
    case 'ASYNC_API':
      return 'asyncapi';
    default:
      return null;
  }
}

export function getApiDisplayName(api) {
  switch (api.spec && api.spec.type) {
    case 'OPEN_API':
      return 'Open API';
    case 'ODATA':
      return 'OData';
    case 'ASYNC_API':
      return 'Events API';
    default:
      return null;
  }
}

export function inferCredentialType(auth) {
  if (auth) {
    if (auth.credential.__typename === 'OAuthCredentialData') {
      return CREDENTIAL_TYPE_OAUTH;
    }
  }
  return CREDENTIAL_TYPE_NONE;
}
