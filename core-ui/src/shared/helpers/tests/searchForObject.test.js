import { searchForObject } from '../searchForObject';

describe('searchForObject', () => {
  test("should work 'small' object", () => {
    const result = searchForObject({ a: { test: 'testData' } }, 'test');
    const expectedValue = { test: 'testData' };

    expect(result).toEqual(expectedValue);
  });

  test('should work with deep example', () => {
    const obj = { a: { b: { c: { d: 'test' } } } };

    const result = searchForObject(obj, 'c');
    const expectedValue = { c: { d: 'test' } };

    expect(result).toEqual(expectedValue);
  });

  test('should work with wide example', () => {
    const obj = {};
    ['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach(elem => {
      obj[elem] = elem;
    });

    const result = searchForObject(obj, 'c');
    const expectedValue = obj;

    expect(result).toEqual(expectedValue);
  });

  describe('Advanced test cases', () => {
    const keyVal = 'Schema';
    const key = 'name';
    const testObj1 = {
      test: {
        deep: { deeper: { data: 'something', name: keyVal } },
        name: keyVal,
      },
    };
    const testObj2 = [
      {},
      { test: 'test' },
      [{ test: { [key]: keyVal, data: 'randomData' } }],
    ];

    const testObj3 = [
      { data: 'data' },
      { [key]: keyVal, additional: 'something' },
      { [key]: keyVal },
    ];

    test('should work with data resembling OData schema', () => {
      const result = searchForObject(testObj1, key);
      const expectedValue = testObj1.test;

      expect(result).toEqual(expectedValue);
    });

    test('should work with data resembling OData schema', () => {
      const result = searchForObject(testObj1, key);
      const expectedValue = testObj1.test;

      expect(result).toEqual(expectedValue);
    });

    test('should work with arrays inside objects inside objects etc', () => {
      const result = searchForObject(testObj2, key);
      const expectedValue = testObj2[2][0].test;

      expect(result).toEqual(expectedValue);
    });

    test('should get first encountered entry', () => {
      const result = searchForObject(testObj3, key);
      const expectedValue = testObj3[1];

      expect(result).toEqual(expectedValue);
    });
  });
});
