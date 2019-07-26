import Ajv from 'ajv';
import draft04 from 'ajv/lib/refs/json-schema-draft-04.json';

import asyncAPISchema from './schemas/asyncAPI';
import ODataSchema from './schemas/OData';
import openAPISchema from './schemas/openAPI';

export const SPEC_UNKNOWN = 'UNKNOWN';

export default class SchemaValidator {
  constructor() {
    this.ajv = new Ajv({ schemaId: 'id' });
    this.ajv.addMetaSchema(draft04);
  }

  validateSpec(spec) {
    for (const api in SchemaValidator.APIs) {
      console.log(api);
        if (api.validationFunction(spec)) {
            return this.validateFor(spec, api);
        }
    }

    return {
        type: SPEC_UNKNOWN,
        valid: false,
    };
  }

  validateFor(spec, api) {
    const apiEntry = SchemaValidator.APIs[api];
    console.log(apiEntry);
    const valid = this.ajv.validate(apiEntry.schema, spec);
    var res = {
      mainType: apiEntry.mainType,
      apiType: apiEntry.apiType,
      success: valid,
      errors: this.ajv.errors,
    };
    console.log(res);
    return res; // todo merge
  }
}

SchemaValidator.APIs = {
  ASYNC_API: {
    schema: asyncAPISchema,
    mainType: 'EVENT_API',
    apiType: 'ASYNC_API',
    // according to https://www.asyncapi.com/docs/specifications/1.2.0/#a-name-a2sobject-a-asyncapi-object
    validationFunction: spec => 'asyncapi' in spec,
  },
  OPEN_API: {
    schema: openAPISchema,
    mainType: 'API',
    apiType: 'ASYNC_API',
    // according to https://swagger.io/specification/#fixed-fields
    validationFunction: spec => 'openapi' in spec,
  },
  ODATA: {
    schema: ODataSchema,
    mainType: 'API',
    apiType: 'ODATA',
    validationFunction: spec => 'edmx:Edmx' in spec,
  },
};
