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
    'JSON': JSON.parse,
    'XML': parseXML,
    'YAML': jsyaml.safeLoad,
  };

  for (const type of Object.keys(parsers)){
    try {
      return {
        spec: parsers[type](textData),
        type
      }
    }
    catch (e) {
      console.warn(e);
      // move on to the next parser
    }
  }
  return null;
}
