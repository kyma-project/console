import { CPU_REGEXP, MEMORY_REGEXP } from '../constants';

describe('CPU_REGEXP', () => {
  test.each([
    ['500m', true],
    ['59m', true],
    ['abc', false],
    ['50.5m', true],
    ['10', true],
    ['0.1', true],
    ['50u', false],
  ])('CPU_REGEXP.test("%s")===%p', (data, expected) => {
    expect(CPU_REGEXP.test(`${data}`)).toBe(expected);
  });
});

describe('MEMORY_REGEXP', () => {
  test.each([
    ['abcGi', false],
    ['50.5K', true],
    ['10', false],
    ['0.1', false],
    ['50Ti', false],
    ['50Ki', true],
    ['50K', true],
    ['50Gi', true],
    ['50G', true],
    ['50Mi', true],
    ['50M', true],
    ['50.3M', true],
    ['-50.3M', false],
  ])('MEMORY_REGEXP.test("%s")===%p', (data, expected) => {
    expect(MEMORY_REGEXP.test(`${data}`)).toBe(expected);
  });
});
