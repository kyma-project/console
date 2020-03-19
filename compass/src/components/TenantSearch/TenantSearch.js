import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { ListGroup, Panel } from 'fundamental-react';
import { getAlternativePath } from 'config/luigi-config/helpers/navigation-helpers';
import './TenantSearch.scss';

const Search = ({ filter, setFilter }) => (
  <input
    autoFocus
    role="search"
    placeholder="Search tenants..."
    value={filter}
    onChange={e => setFilter(e.target.value.trim())}
    type="text"
  />
);

const TenantList = ({ tenants, chooseTenant }) => (
  <ListGroup className="fd-has-margin-top-s">
    {tenants.map(tenant => (
      <ListGroup.Item role="row" key={tenant.id}>
        {/* <p className="link list-item" onClick={() => chooseTenant(tenant)}>
      <span>{tenant.name}{tenant.name}{tenant.name}{tenant.name}{tenant.name}</span> <span>{`(${tenant.id})`}</span>
    </p> */}
        <p className="link" onClick={() => chooseTenant(tenant)}>
          {`${tenant.name} (${tenant.id})`}
        </p>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

export default function TenantSearch() {
  const tenants = LuigiClient.getContext().tenants;
  const [filter, setFilter] = React.useState('');

  const chooseTenant = tenant => {
    const parentPath = decodeURIComponent(
      LuigiClient.getNodeParams().parentPath,
    );
    const path = getAlternativePath(tenant.id, parentPath);
    LuigiClient.linkManager().navigate(`/tenant/${path || tenant.id}`);
  };

  const getFilteredTenants = () => {
    if (!filter) {
      return tenants;
    }
    return tenants.filter(
      tenant => tenant.name.includes(filter) || tenant.id.includes(filter),
    );
  };

  return (
    <Panel className="fd-has-padding-s tenant-search">
      <Search filter={filter} setFilter={setFilter} />
      <TenantList tenants={getFilteredTenants()} chooseTenant={chooseTenant} />
    </Panel>
  );
}
