import { getKeyByValue } from '../helpers';

describe('getKeyByValue', () => {
  test.each([
    [{ a: 1 }, 1, 'a'],
    [{ d: 'Michael has a cat' }, 'Michael has a cat', 'd'],
    [{ d: 'random' }, 'not in object', undefined],
    [undefined, 'not in object', undefined],
    [null, 'not in object', undefined],
    [{}, 'not in object', undefined],
  ])('.getKeyByValue(%o, %s)', (object, value, expected) => {
    expect(getKeyByValue(object, value)).toBe(expected);
  });
});
