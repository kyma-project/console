import React from 'react';
import { TabGroup, Tab } from 'fundamental-react';

import './TabsWithActions.scss';

export function TabsWithActions({
  tabsData = [],
  actions = null,
  className = '',
}) {
  if (!tabsData.length) {
    return null;
  }

  const tabs = tabsData.map(tab => (
    <Tab id={tab.id} key={tab.id} title={tab.title}>
      {tab.body}
    </Tab>
  ));

  return (
    <div className={`fd-panel fd-panel-tabs ${className}`}>
      <TabGroup>{tabs}</TabGroup>
      {actions && (
        <div className="fd-panel__actions fd-panel-tabs__actions">
          {actions}
        </div>
      )}
    </div>
  );
}
