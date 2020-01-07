import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { GenericDocumentation } from '@kyma-project/generic-documentation';

const tabRouteHandler = {
  determineSelectedTab: function(tabList) {
    const selectedTab = LuigiClient.getNodeParams().selectedTab;
    return tabList.indexOf(selectedTab) >= 0
      ? tabList.indexOf(selectedTab)
      : undefined;
  },
  selectTab: function(tabList, index) {
    const activeTab = tabList[index];
    LuigiClient.linkManager()
      .withParams({ selectedTab: activeTab })
      .navigate('');
  },
};

const ServiceInstanceTabs = ({ serviceClass }) => {
  const assetGroup =
    serviceClass && (serviceClass.assetGroup || serviceClass.clusterAssetGroup);

  return (
    <GenericDocumentation
      assetGroup={assetGroup}
      layout="instances-ui"
      tabRouteHandler={tabRouteHandler}
    />
  );
};

ServiceInstanceTabs.propTypes = {
  serviceClass: PropTypes.object.isRequired,
};

export default ServiceInstanceTabs;
