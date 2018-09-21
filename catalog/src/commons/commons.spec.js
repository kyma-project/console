import { randomNameGenerator, validateAsyncApiSpec } from './helpers';
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
    const result =
      randomName.split('-').length === 2 && checkingFormat(randomName);

    expect(result).toEqual(true);
  });
});

describe('validate asyncApiSpec', () => {
  it('should return true, because formatting of asyncApiSpec object is correct', () => {
    const asyncApiSpec = {
      info: {
        title: 'exampleInfo',
        version: 'exampleVersion',
      },
      topics: {
        exampleTopic1: {
          subscribe: {},
        },
        exampleTopic2: {
          subscribe: {},
        },
      },
    };
    const result = validateAsyncApiSpec(asyncApiSpec);

    expect(result).toEqual(true);
  });

  it('should return false, because topics field is undefined', () => {
    const asyncApiSpec = {
      info: {
        title: 'exampleInfo',
        version: 'exampleVersion',
      },
    };
    const result = validateAsyncApiSpec(asyncApiSpec);

    expect(result).toEqual(false);
  });

  it('should return false, because info field is undefined', () => {
    const asyncApiSpec = {
      topics: {
        exampleTopic1: {
          subscribe: {},
        },
        exampleTopic2: {
          subscribe: {},
        },
      },
    };
    const result = validateAsyncApiSpec(asyncApiSpec);

    expect(result).toEqual(false);
  });

  it('should return false, because title field in info object is undefined', () => {
    const asyncApiSpec = {
      info: {
        version: 'exampleVersion',
      },
      topics: {
        exampleTopic1: {
          subscribe: {},
        },
        exampleTopic2: {
          subscribe: {},
        },
      },
    };
    const result = validateAsyncApiSpec(asyncApiSpec);

    expect(result).toEqual(false);
  });

  it('should return false, because version field in info object is undefined', () => {
    const asyncApiSpec = {
      info: {
        version: 'exampleVersion',
      },
      topics: {
        exampleTopic1: {
          subscribe: {},
        },
        exampleTopic2: {
          subscribe: {},
        },
      },
    };
    const result = validateAsyncApiSpec(asyncApiSpec);

    expect(result).toEqual(false);
  });

  it('should return false, because topics object does not have at least one topic field', () => {
    const asyncApiSpec = {
      info: {
        title: 'exampleInfo',
        version: 'exampleVersion',
      },
      topics: {},
    };
    const result = validateAsyncApiSpec(asyncApiSpec);

    expect(result).toEqual(false);
  });

  it('should return false, because one of the topics object does not have subscribe field', () => {
    const asyncApiSpec = {
      info: {
        title: 'exampleInfo',
        version: 'exampleVersion',
      },
      topics: {
        exampleTopic1: {
          subscribe: {},
        },
        exampleTopic2: {
          notSubscribe: {},
        },
      },
    };
    const result = validateAsyncApiSpec(asyncApiSpec);

    expect(result).toEqual(false);
  });
});
