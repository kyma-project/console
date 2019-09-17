import jsyaml from 'js-yaml';

export function isFileTypeValid(fileName) {
  const validExtensions = ['yaml', 'yml', 'json'];
  return validExtensions.some(extension => fileName.endsWith(extension));
}

export function checkAndStringifySpec(specification) {
  try {
    const checkedSchema = jsyaml.safeLoad(specification);
    return typeof checkedSchema === 'string'
      ? checkedSchema
      : JSON.stringify(checkedSchema);
  } catch (e) {
    console.warn(e);
    return null;
  }
}
