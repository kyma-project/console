import jsyaml from 'js-yaml';
import xmlJS from 'xml-js';

function isYaml(file) {
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
  // xmlJS returns empty object, if parsing failed
  if (!Object.keys(parsed).length) {
    return Error('Spec file is corrupted');
  }
  return parsed;
}

export function isFileTypeValid(file) {
  return isYaml(file) || isJSON(file) || isXML(file);
}

export function parseSpecFromText(textData) {
  const parsers = {
    JSON: JSON.parse,
    XML: parseXML,
    YAML: jsyaml.safeLoad,
  };

  const errors = [];
  for (const type of Object.keys(parsers)) {
    try {
      return {
        spec: parsers[type](textData),
        type,
      };
    } catch (e) {
      errors.push(e);
      // move on to the next parser
    }
  }

  // warn only if no parser succeeded
  errors.forEach(console.warn);

  return null;
}

export function getSpecType(spec) {
  // according to https://www.asyncapi.com/docs/specifications/1.2.0/#a-name-a2sobject-a-asyncapi-object
  if ('asyncapi' in spec) {
    return {
      mainType: 'ASYNC_API',
      subType: 'ASYNC_API',
    };
  }
  // according to https://swagger.io/specification/#fixed-fields
  if ('openapi' in spec) {
    return {
      mainType: 'API',
      subType: 'OPEN_API',
    };
  }
  // OData should be in EDMX format
  if ('edmx:Edmx' in spec) {
    return {
      mainType: 'API',
      subType: 'ODATA',
    };
  }

  return null;
}
