import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { ListGroup, Panel } from 'fundamental-react';
import { getAlternativePath } from 'config/luigi-config/helpers/navigation-helpers';
import './TenantSearch.scss';

export default function TenantSearch() {
  const tenants = LuigiClient.getContext().tenants;
  const [filter, setFilter] = React.useState('');

  const chooseTenant = tenant => {
    const fromPath = decodeURIComponent(LuigiClient.getNodeParams().path);
    const path = getAlternativePath(tenant.id, fromPath);
    LuigiClient.linkManager().navigate(
      path ? `/tenant/${path}` : `/tenant/${tenant.id}`,
    );
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
      <div className="fd-combobox-control">
        <input
          autoFocus
          aria-label="search-input"
          placeholder="Search tenants..."
          value={filter}
          onChange={e => setFilter(e.target.value.trim())}
          type="text"
        />
      </div>
      <ListGroup className="fd-has-margin-top-s">
        {getFilteredTenants().map(tenant => (
          <ListGroup.Item key={tenant.id}>
            {/* <p className="link list-item" onClick={() => chooseTenant(tenant)}>
              <span>{tenant.name}{tenant.name}{tenant.name}{tenant.name}{tenant.name}</span> <span>{`(${tenant.id})`}</span>
            </p> */}
            <p className="link" onClick={() => chooseTenant(tenant)}>
              {`${tenant.name} (${tenant.id})`}
            </p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Panel>
  );
}
