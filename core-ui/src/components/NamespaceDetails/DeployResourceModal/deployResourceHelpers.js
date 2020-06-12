import jsyaml from 'js-yaml';

function validateFile(file) {
  if (!file) {
    return 'File is required';
  }

  if (!file.size) {
    return 'File cannot be empty';
  }

  const allowedTypes = ['application/json', 'application/x-yaml'];
  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file extension';
  }
  return '';
}

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsText(file);
  });
}

function validateFileContent(content) {
  if (!content || typeof content !== 'object') {
    return 'Resource must be an object';
  }

  const requiredProps = ['kind', 'metadata', 'apiVersion'];
  if (requiredProps.some(prop => typeof content[prop] === 'undefined')) {
    return 'Fields "apiVersion", "kind" and "metadata" are required';
  }
  return '';
}

export async function parseFile(file) {
  const fileError = validateFile(file);
  if (fileError) {
    return [null, fileError];
  }

  let content;
  try {
    content = jsyaml.safeLoad(await readFile(file));
  } catch (_) {
    return [null, 'Cannot parse file content'];
  }

  return [content, validateFileContent(content)];
}

export function getResourceUrl(domain, kind, apiVersion, namespace) {
  const k8sApiServerUrl = `https://apiserver.${domain}/api/v1/`;
  const resource = kind.toLowerCase() + 's';

  switch (apiVersion) {
    case 'v1':
      return `${k8sApiServerUrl}namespaces/${namespace}/${resource}`;
    default:
      return `${k8sApiServerUrl}/apis/${apiVersion}/namespaces/${namespace}/${resource}`;
  }
}
