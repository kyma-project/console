import React from 'react';
import LuigiClient from '@luigi-project/client';

import fetchTenants from './fetchTenants';
import { ListGroup, Panel } from 'fundamental-react';
import { useMicrofrontendContext } from 'react-shared';
import { getAlternativePath } from '../../config/luigi-config/helpers/getAlternativePath';
import './TenantSearch.scss';

const SearchInput = ({ filter, setFilter }) => (
  <input
    autoFocus
    role="search"
    placeholder="Search tenants..."
    value={filter}
    onChange={e => setFilter(e.target.value)}
    type="text"
  />
);

const TenantList = ({ tenants, chooseTenant }) => (
  <ListGroup className="fd-has-margin-top-s">
    {tenants.map(tenant => (
      <ListGroup.Item
        role="row"
        key={tenant.id}
        onClick={() => chooseTenant(tenant)}
        className="list-item"
      >
        <span className="link">{tenant.name}</span>
        <span className="fd-has-color-text-3">{tenant.id}</span>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export function TenantSearch({ parentPath, token, _tenants }) {
  const [filter, setFilter] = React.useState('');
  const [tenants, setTenants] = React.useState(_tenants);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!tenants.length) {
      fetchTenants(token)
        .then(setTenants)
        .catch(e =>
          setError(`Error: tenants could not be loaded: ${e.message}`),
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chooseTenant = tenant => {
    const path = getAlternativePath(tenant.id, parentPath);
    LuigiClient.linkManager().navigate(`/tenant/${path || tenant.id}`);
  };

  const getFilteredTenants = () => {
    const searchPhrase = filter.toLowerCase();
    if (!searchPhrase.trim()) {
      return tenants.filter(t => t.initialized);
    }
    return tenants.filter(
      tenant =>
        tenant.name.toLowerCase() === searchPhrase ||
        tenant.id.toLowerCase() === searchPhrase,
    );
  };

  return (
    <Panel className="fd-has-padding-s tenant-search">
      <SearchInput filter={filter} setFilter={setFilter} />
      {error && <p className="fd-has-color-status-3">{error}</p>}
      <TenantList tenants={getFilteredTenants()} chooseTenant={chooseTenant} />
    </Panel>
  );
}

export default function TenantSearchWrapper() {
  const { tenants, idToken } = useMicrofrontendContext();

  return (
    <TenantSearch
      token={idToken}
      _tenants={tenants}
      parentPath={document.referrer}
    />
  );
}
