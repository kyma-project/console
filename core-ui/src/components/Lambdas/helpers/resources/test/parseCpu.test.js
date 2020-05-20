import { CPU_REGEXP, MEMORY_REGEXP } from '../constants';
import { parseCpu } from '../parseCpu';

describe('parseCpu', () => {
  test.each([
    ['500u', '0.5m'],
    ['59m', '59m'],
    ['abc', 'abc'],
    ['5000n', '0.005m'],
    ['500n', '0.0005m'],
  ])('.parseCpu("%s")=="%s"', (data, expected) => {
    expect(parseCpu(data)).toBe(expected);
  });
});

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
