import jsyaml from "js-yaml";

function isYaml(file) {
  return file.name.endsWith(".yaml") || file.name.endsWith(".yml");
}

function isJSON(file) {
  return file.name.endsWith(".json");
}

export function isFileTypeValid(file) {
  return isYaml(file) || isJSON(file);
}

// extension-based check
export function getFileType(file) {
  return isYaml(file) ? "YAML" : "JSON";
}

// content-based check
export function getSpecFileType(fileContent) {
  try {
    JSON.parse(fileContent);
    return "JSON";
  } catch (e) {
    // todo we can assume YAML, as it should have been checked in loadSpec
    return "YAML";
  }
}

export function isSpecAsyncAPI(spec) {
  // according to https://www.asyncapi.com/docs/specifications/1.2.0/#a-name-a2sobject-a-asyncapi-object
  return "asyncapi" in spec;
}

export function isSpecOpenAPI(spec) {
  // according to https://swagger.io/specification/#format
  return "openapi" in spec;
}

export function getAPISpecType(spec) {
  return isSpecOpenAPI(spec) ? "OPEN_API" : "ODATA";
}

export function getAsyncAPISpecType() {
  // according to documentation, for now there's only one possible value
  return "ASYNC_API";
}

export function loadSpec(fileContent) {
  try {
    // jsyaml can read both YAML and JSON,
    // as every valid JSON is also valid YAML
    return jsyaml.safeLoad(fileContent);
  } catch (e) {
    console.warn(e);
    return null;
  }
}

export function createAPI(apiData) {
  return {
    name: apiData.name,
    description: apiData.description,
    targetUrl: apiData.targetUrl,
    group: apiData.group ? apiData.group : null,
    spec: {
      data: apiData.spec,
      format: apiData.actualFileType,
      type: getAPISpecType(apiData.spec)
    },
    defaultAuth: {
      credentials: {
        clientId: apiData.clientID,
        clientSecret: apiData.clientSecret,
        url: apiData.url
      }
    }
  };
}

export function createEventAPI(apiData) {
  return {
    name: apiData.name,
    description: apiData.description,
    group: apiData.group ? apiData.group : null,
    spec: {
      data: apiData.spec,
      format: apiData.actualFileType,
      type: getAsyncAPISpecType()
    }
  };
}
