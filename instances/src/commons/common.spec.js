import { validateAsyncApiSpec } from './helpers';

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
