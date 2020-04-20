import {
  getTenantNames,
  getPreviousLocation,
  setCurrentLocation,
} from './navigation-helpers';

const address = 'http://test.com/test/path';
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

  it('routes to tenant home page by default', () => {
    const tenant = { name: 'tenant', id: '1234' };

    const options = getTenantNames([tenant]);

    expect(options).toHaveLength(1);
    expect(options[0].pathValue).toEqual(tenant.id);
  });
});

describe('getPreviousLocation', () => {
  const { localStorage } = window;

  beforeAll(() => {
    delete window.localStorage;
    window.localStorage = {
      getItem: jest.fn(() => {
        return address;
      }),
      removeItem: jest.fn(),
    };
  });

  afterAll(() => {
    window.localStorage = localStorage;
  });

  it('returns location from a localStorage', () => {
    const location = getPreviousLocation();

    expect(location).toEqual('http://test.com/test/path');
    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      'console.location',
    );
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(
      'console.location',
    );
  });
});

describe('setCurrentLocation', () => {
  const { location, localStorage } = window;

  beforeAll(() => {
    delete window.location;
    delete window.localStorage;
    window.location = { href: address };
    window.localStorage = {
      setItem: jest.fn(),
    };
  });

  afterAll(() => {
    window.location = location;
    window.localStorage = localStorage;
  });

  it('saves current location in a localStorage', () => {
    setCurrentLocation();

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'console.location',
      address,
    );
  });
});
