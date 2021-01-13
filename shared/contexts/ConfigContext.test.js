import { configFromEnvVariables } from './ConfigContext';

describe('configFromEnvVariables', () => {
  it('takes all properties with prefix', () => {
    const result = configFromEnvVariables(
      {
        prefix_prop1: '1',
        prefix_prop2: '2',
      },
      'prefix_',
    );
    expect(result).toEqual({ prop1: '1', prop2: '2' });
  });

  it('ignores propertis with wrong prefix', () => {
    const result = configFromEnvVariables(
      {
        non_prefix_prop1: '1',
        other_prop: '2',
      },
      'prefix_',
    );
    expect(result).toEqual({});
  });

  it('defaults to fallback', () => {
    window.clusterConfig = {};
    const result = configFromEnvVariables(
      {
        prefix_prop1: '1',
      },
      'prefix_',
      {
        prop1: '0',
        prop2: '2',
      },
    );
    expect(result).toEqual({ prop1: '1', prop2: '2' });
  });
});
