import { parseCpu, normalizeCPU } from '../cpuHelpers';

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

describe('normalizeCPU', () => {
  test.each([
    ['', 0],
    ['59m', 0.059],
    ['1', 1],
    ['1.005', 1.005],
    ['59.5m', 0.0595],
  ])('.normalizeCPU("%s")=="%s"', (data, expected) => {
    expect(normalizeCPU(data)).toBe(expected);
  });
});
