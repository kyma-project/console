export const labelsSchema = {
  title: "Example Schema",
  type: "object",
  patternProperties: {
    "^.*$": {
      anyOf: [
        {
          type: "array",
          items: {
            type: "string"
          }
        },
        {
          type: "null"
        }
      ]
    }
  }
};
