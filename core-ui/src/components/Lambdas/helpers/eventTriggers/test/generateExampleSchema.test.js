import { generateExampleSchema } from '../generateExampleSchema';

describe('generateExampleSchema', () => {
  test('should return empty object by default', () => {
    const result = generateExampleSchema({});
    expect(result).toEqual({});
  });

  test('should instantiate all properties', () => {
    const result = generateExampleSchema({
      properties: {
        a: { type: 'string' },
        b: { type: 'integer' },
      },
    });
    expect(result).toEqual({
      a: 'string',
      b: 0,
    });
  });
});
