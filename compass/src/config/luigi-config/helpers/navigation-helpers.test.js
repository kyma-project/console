import { getTenantNames } from './navigation-helpers';

describe('getTenantNames', () => {
  it('sorts tenants by name', () => {
    const tenants = [
      { name: 'B', id: '1234' },
      { name: 'A', id: '4321' },
      { name: 'C', id: '6666' },
    ];

    const options = getTenantNames(tenants);

    expect(options).toHaveLength(3);
    expect(options[0]).toEqual({
      label: tenants[1].name,
      pathValue: tenants[1].id,
    });
    expect(options[1]).toEqual({
      label: tenants[0].name,
      pathValue: tenants[0].id,
    });
    expect(options[2]).toEqual({
      label: tenants[2].name,
      pathValue: tenants[2].id,
    });
  });
});
