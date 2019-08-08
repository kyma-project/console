import jsyaml from 'js-yaml';

export function isFileTypeValid(fileName) {
  const validExtensions = ['yaml', 'yml', 'json'];
  return validExtensions.some(extension => fileName.endsWith(extension));
}

export function parseSpecification(specification) {
  try {
    return jsyaml.safeLoad(specification);
  } catch (e) {
    console.warn(e);
    return null;
  }
}
