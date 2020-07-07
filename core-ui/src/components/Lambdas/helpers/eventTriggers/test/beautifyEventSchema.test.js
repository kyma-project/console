import { beautifyEventSchema } from '../beautifyEventSchema';
import { renderMd } from '../../misc/renderMarkdown';

describe('beautifyEventSchema', () => {
  test('should return null', () => {
    const schema = null;
    const result = beautifyEventSchema(schema);
    expect(result).toEqual(schema);
  });

  test('should return empty object', () => {
    const schema = {};
    const result = beautifyEventSchema(schema);
    expect(result).toEqual(schema);
  });

  test('should return beautified schema - without example', () => {
    const firstNameDescription = "The person's first name.";
    const lastNameDescription = "The person's last name.";
    const ageDescription =
      'Age in years which must be equal to or greater than zero.';

    const schema = {
      properties: {
        firstName: {
          type: 'string',
          description: "The person's first name.",
        },
        lastName: {
          type: 'string',
          description: "The person's last name.",
        },
        age: {
          type: 'integer',
          description:
            'Age in years which must be equal to or greater than zero.',
        },
      },
    };
    const expected = {
      properties: {
        firstName: {
          type: 'string',
          description: renderMd(firstNameDescription),
        },
        lastName: {
          type: 'string',
          description: renderMd(lastNameDescription),
        },
        age: {
          type: 'integer',
          description: renderMd(ageDescription),
        },
      },
      example: {
        firstName: 'string',
        lastName: 'string',
        age: 0,
      },
    };

    const result = beautifyEventSchema(schema);
    expect(result).toEqual(expected);
  });

  test('should return beautified schema - with example', () => {
    const firstNameDescription = "The person's first name.";
    const lastNameDescription = "The person's last name.";
    const ageDescription =
      'Age in years which must be equal to or greater than zero.';

    const schema = {
      properties: {
        firstName: {
          type: 'string',
          description: "The person's first name.",
        },
        lastName: {
          type: 'string',
          description: "The person's last name.",
        },
        age: {
          type: 'integer',
          description:
            'Age in years which must be equal to or greater than zero.',
        },
      },
      example: {
        firstName: 'firstName',
        lastName: 'lastName',
        age: 1,
      },
    };
    const expected = {
      properties: {
        firstName: {
          type: 'string',
          description: renderMd(firstNameDescription),
        },
        lastName: {
          type: 'string',
          description: renderMd(lastNameDescription),
        },
        age: {
          type: 'integer',
          description: renderMd(ageDescription),
        },
      },
      example: {
        firstName: 'firstName',
        lastName: 'lastName',
        age: 1,
      },
    };

    const result = beautifyEventSchema(schema);
    expect(result).toEqual(expected);
  });

  test('should not crash when additionalProperties is set as string', () => {
    const schema = {
      additionalProperties: 'false',
    };
    const expected = {
      additionalProperties: 'false',
      example: {},
    };

    const result = beautifyEventSchema(schema);
    expect(result).toEqual(expected);
  });
});
