import React from 'react';
import LuigiClient from '@luigi-project/client';

import { PageHeader, Tabs, Tab } from 'react-shared';
import ClusterRoleList from '../ClusterRoleList/ClusterRoleList';
import ClusterRoleBindingList from '../ClusterRoleBindingList/ClusterRoleBindingList';
import './PermissionList.scss';

export default function GlobalPermissions() {
  const { selectedTab } = LuigiClient.getNodeParams();
  const tabName = selectedTab || 'bindings';

  const tabs = ['bindings', 'clusterRoles'];
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
        <Tab title="Cluster Role Bindings">
          <ClusterRoleBindingList />
        </Tab>
        <Tab title="Cluster Roles">
          <ClusterRoleList />
        </Tab>
      </Tabs>
    </div>
  );
}
