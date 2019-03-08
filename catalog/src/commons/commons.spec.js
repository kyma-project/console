import { randomNameGenerator } from './helpers';
import { adjectives, nouns } from './random-names-data';

const checkingFormat = name => {
  const result =
    /^[a-z0-9-]+$/.test(name) &&
    /[a-z0-9]/.test(name[0]) &&
    /[a-z0-9]/.test(name[name.length - 1]);

  return result;
};

const checkingPattern = names => {
  for (let i = 0; i < names.length; i++) {
    if (!checkingFormat(names[i].toLowerCase())) return false;
  }
  return true;
};

describe('correctly adjectives', () => {
  it('should return true if the all adjectives have a correctly pattern', () => {
    expect(checkingPattern(adjectives)).toEqual(true);
  });
});

describe('correctly nouns', () => {
  it('should return true if the all nouns have a correctly pattern', () => {
    expect(checkingPattern(nouns)).toEqual(true);
  });
});

describe('correctly random name', () => {
  it('should return true if the random name has a correctly pattern', () => {
    const randomName = randomNameGenerator();
    const result = checkingFormat(randomName.toLowerCase());

    expect(result).toEqual(true);
  });
});
