import { normalizeMemory, compareMemory } from '../memoryHelpers';

describe('normalizeMemory', () => {
  test.each([
    ['', 0],
    ['1Mi', 1024 ** 2],
    ['1M', 10 ** 6],
    ['1MiB', 1024 ** 2],
    ['1MB', 10 ** 6],
  ])('.normalizeMemory("%s")=="%s"', (data, expected) => {
    expect(normalizeMemory(data)).toBe(expected);
  });
});

describe('compareMemory', () => {
  test.each([
    ['50Mi', '50Mi', true],
    ['49.9Mi', '50Mi', true],
    ['50.1Mi', '50Mi', false],
  ])('.compareMemory("%s", "%s")=="%s"', (limit, current, expected) => {
    expect(compareMemory(limit, current)).toBe(expected);
  });
});
