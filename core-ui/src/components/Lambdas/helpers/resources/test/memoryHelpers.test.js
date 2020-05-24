import { normalizeMemory } from '../memoryHelpers';

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
