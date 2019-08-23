const invalidSchema = { thisSchema: "has no 'properties' key" };
const validSchema = { properties: { propertyOne: {} } };

module.exports = {
  Query: {
    labelDefinitions: (obj, args, context, info) => [
      {
        key: 'testkey',
        schema: null,
      },
    ],

    labelDefinition: (obj, args, context, info) => {
      switch (args.key) {
        case 'noschemalabel':
          return {
            key: 'noschemalabel',
            schema: null,
          };
        case 'labelWithInvalidSchema':
          return {
            key: 'labelWithInvalidSchema',
            schema: invalidSchema,
          };
        case 'labelWithValidSchema':
          return {
            key: 'labelWithValidSchema',
            schema: validSchema,
          };
        // case 'noschemalabel':
        //     return {
        //         key: 'noschemalabel',
        //         schema: null,
        //     };
      }
    },
  },
};
