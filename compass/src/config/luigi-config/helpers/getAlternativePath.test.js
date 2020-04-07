import { getAlternativePath } from './getAlternativePath';

describe('getAlternativePath', () => {
  it('returns null on tenantless address', () => {
    const url = 'http://compass.dev:8080/overvue';

    const path = getAlternativePath('any tenant', url);

    expect(path).toBe(null);
  });

  it('returns the same path for the same tenant', () => {
    const currentTenant = 'a-tenant';
    const url = `http://compass-dev:8080/tenant/${currentTenant}/kymas/1`;

    const path = getAlternativePath(currentTenant, url);

    expect(path).toBe(`${currentTenant}/kymas/1`);
  });

  it('preserves context on tenant switch, discarding further path', () => {
    const currentTenant = 'a-tenant';
    const url = 'http://compass-dev:8080/tenant/other-tenant/kymas/1';

    const path = getAlternativePath(currentTenant, url);

    expect(path).toBe(`${currentTenant}/kymas`);
  });
});
