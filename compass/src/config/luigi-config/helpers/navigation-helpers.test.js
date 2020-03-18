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
    expect(options[0].label).toEqual(tenants[1].name);
    expect(options[1].label).toEqual(tenants[0].name);
    expect(options[2].label).toEqual(tenants[2].name);
  });
});
