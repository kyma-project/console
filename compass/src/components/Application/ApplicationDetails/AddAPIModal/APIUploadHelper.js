import jsyaml from "js-yaml";

function isYaml(file) {
  return file.name.endsWith(".yaml") || file.name.endsWith(".yml");
}

function isJSON(file) {
  return file.name.endsWith(".json");
}

function isSpecAsyncAPI(spec) {
  // according to https://www.asyncapi.com/docs/specifications/1.2.0/#a-name-a2sobject-a-asyncapi-object
  return "asyncapi" in spec;
}

export function isFileTypeValid(file) {
  return isYaml(file) || isJSON(file);
}

// content-based check for parseable file content
export function getSpecFileType(textData) {
  try {
    JSON.parse(textData);
    return "JSON";
  } catch (e) {
    return "YAML";
  }
}

export function getSpecType(spec) {
  return isSpecAsyncAPI(spec) ? "EVENT_API" : "API"
}

export function getAPISpecType(spec) {
  // according to https://swagger.io/specification/#format
  const isOpenAPI = "openapi" in spec;
  return isOpenAPI? "OPEN_API" : "ODATA";
}

export function getAsyncAPISpecType() {
  // according to documentation, for now there's only one possible value
  return "ASYNC_API";
}

export function parseSpecFromText(textData) {
  try {
    // jsyaml can read both YAML and JSON,
    // as every valid JSON is also avalid YAML
    return jsyaml.safeLoad(textData);
  } catch (e) {
    return null;
  }
}
