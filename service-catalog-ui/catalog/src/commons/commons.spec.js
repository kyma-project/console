import { randomNameGenerator } from './helpers';

const checkingFormat = name => {
  const result =
    /^[a-z0-9-]+$/.test(name) &&
    /[a-z0-9]/.test(name[0]) &&
    /[a-z0-9]/.test(name[name.length - 1]);

  return result;
};

describe('correctly random name', () => {
  it('should return true if the random name has a correctly pattern', () => {
    const randomName = randomNameGenerator();
    const result = checkingFormat(randomName.toLowerCase());

    expect(result).toEqual(true);
  });
});
