import { parseCpu, cpuRegexp, memoryRegexp } from '../ResourceManagement';

describe('parseCpu', () => {
  test.each([['500u', '0.5m'], ['59m', '59m'], ['abc', 'abc']])(
    '.parseCpu("%s")=="%s"',
    (data, expected) => {
      expect(parseCpu(data)).toBe(expected);
    },
  );
});

describe('cpuRegexp', () => {
  test.each([
    ['500m', true],
    ['59m', true],
    ['abc', false],
    ['50.5m', true],
    ['10', true],
    ['0.1', true],
    ['50u', false],
  ])('cpuRegexp.test("%s")===%p', (data, expected) => {
    expect(cpuRegexp.test(`${data}`)).toBe(expected);
  });
});

describe('memoryRegexp', () => {
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
  ])('memoryRegexp.test("%s")===%p', (data, expected) => {
    expect(memoryRegexp.test(`${data}`)).toBe(expected);
  });
});
