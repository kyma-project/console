import jsyaml from 'js-yaml'

function isYaml(file) {
    return file.name.endsWith('.yaml') ||
        file.name.endsWith('.yml');
}

function isJSON(file) {
    return file.name.endsWith('.json');
}

export function isFileTypeValid(file) {
    return isYaml(file) || isJSON(file);
}

export function getFileType(file) {
    return isYaml(file) ? 'YAML' : 'JSON';
}

export function isSpecAsyncAPI(spec) {
    // according to https://www.asyncapi.com/docs/specifications/1.2.0/#a-name-a2sobject-a-asyncapi-object
    return 'asyncapi' in spec;
}

export function isSpecOpenAPI(spec) {
    // according to https://swagger.io/specification/#format
    return 'openapi' in spec;
}

export function getAPISpecType(spec) {
    return isSpecOpenAPI(spec) ? 'OPEN_API' : 'ODATA';
}

export function getAsyncAPISpecType() {
     // according to documentation, fot now there's only one possible value
    return "ASYNC_API";
}

export function loadSpec(fileContent) {
    try {
      // jsyaml can read both YAML and JSON!
      return jsyaml.safeLoad(fileContent);
    }
    catch(e) {
      console.warn(e);
      return null;
    }
  }
  
  export function createAPI(name, specFile, spec) {
    return {
      name,
      spec: {
        data: spec,
        format: getFileType(specFile),
        type: getAPISpecType(spec)
      }
    };
  }

  export function createEventAPI(name, specFile, spec) {
    return {
      name,
      spec: {
        data: spec,
        format: getFileType(specFile),
        eventSpecType: getAsyncAPISpecType()
      }
    };
  }
