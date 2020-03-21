import merge from 'merge';
import { renderMd } from '../misc/renderMarkdown';
import { generateExampleSchema } from './generateExampleSchema';

export function beautifyEventSchema(eventSchema) {
  const schema = resolveAllOf(eventSchema);

  if (!schema || !Object.keys(schema).length) {
    return schema;
  }

  if (schema.properties) {
    const properties = schema.properties;
    const newProperties = properties;

    for (const [key, prop] of Object.entries(properties)) {
      if (prop.description) {
        prop.description = renderMd(prop.description);
      }
      if (prop.properties) {
        const propProperties = prop.properties;
        const newPropProperties = {};

        for (const [propKey, propValue] of Object.entries(propProperties)) {
          newPropProperties[propKey] =
            beautifyEventSchema(propValue) || propValue;
        }

        prop.properties = newPropProperties;
      }

      newProperties[key] = prop;
    }
    schema.properties = newProperties;
  }

  if (schema.additionalProperties) {
    const additionalProperties = schema.additionalProperties;
    const newAdditionalProperties = additionalProperties;

    for (const [key, prop] of Object.entries(additionalProperties)) {
      if (prop.description) {
        prop.description = renderMd(prop.description);
      }
      if (prop.additionalProperties) {
        const propAdditionalProperties = prop.additionalProperties;
        const newPropAdditionalProperties = {};

        for (const [propKey, propValue] of Object.entries(
          propAdditionalProperties,
        )) {
          newPropAdditionalProperties[propKey] =
            beautifyEventSchema(propValue) || propValue;
        }
        prop.properties = newPropAdditionalProperties;
      }

      newAdditionalProperties[key] = prop;
    }
    schema.additionalProperties = newAdditionalProperties;
  }

  if (
    !schema.hasOwnProperty('example') ||
    !Object.keys(schema.example).length
  ) {
    schema.example = generateExampleSchema(schema);
  }

  return schema;
}

function resolveAllOf(schema) {
  if (!schema || !Object.keys(schema).length) {
    return schema;
  }

  if (schema.allOf) {
    let schemas = [];
    schema.allOf.forEach(s => {
      schemas.push(resolveAllOf(s) || s);
    });
    schemas = schemas.filter(Boolean);

    return merge.recursive(...schemas);
  }

  if (schema.properties) {
    const transformed = {};

    for (const [key, property] of Object.entries(schema.properties)) {
      if (typeof property !== 'object' || !property) {
        continue;
      }
      if (property.allOf) {
        transformed[key] = resolveAllOf(property) || property;
        continue;
      }
      transformed[key] = property;
    }

    return { ...schema, properties: transformed };
  }

  return schema;
}
