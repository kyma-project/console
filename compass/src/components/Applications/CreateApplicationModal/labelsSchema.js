export const labelsSchema = {
  title: 'Application labels',
  type: 'object',
  patternProperties: {
    '^.*$': {
      anyOf: [
        {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        {
          type: 'null',
        },
      ],
    },
  },
};
