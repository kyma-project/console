import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';

import { PageHeader, Tabs, Tab } from 'react-shared';
import RoleBindingList from '../RoleBindingList/RoleBindingList';
import ClusterRoleList from '../ClusterRoleList/ClusterRoleList';
import RoleList from '../RoleList/RoleList';
import './PermissionList.scss';

NamespacePermissions.propTypes = { namespaceId: PropTypes.string.isRequired };

export default function NamespacePermissions({ namespaceId }) {
  const { selectedTab } = LuigiClient.getNodeParams();
  const tabName = selectedTab || 'bindings';

  const tabs = ['bindings', 'roles', 'clusterRoles'];
  const tabIndexToName = i => tabs[i];
  const nameToTabIndex = name => tabs.indexOf(name);

  const handleTabChange = activeTabIndex =>
    LuigiClient.linkManager()
      .withParams({ selectedTab: tabIndexToName(activeTabIndex) })
      .navigate('');

  return (
    <div className="permission-list">
      <PageHeader title="Permissions"></PageHeader>
      <Tabs
        callback={handleTabChange}
        defaultActiveTabIndex={nameToTabIndex(tabName)}
        className="fd-has-padding-left-s"
      >
        <Tab title="Role Bindings">
          <RoleBindingList namespaceId={namespaceId} />
        </Tab>
        <Tab title="Roles">
          <RoleList namespaceId={namespaceId} />
        </Tab>
        <Tab title="Cluster Roles">
          <ClusterRoleList />
        </Tab>
      </Tabs>
    </div>
  );
}
