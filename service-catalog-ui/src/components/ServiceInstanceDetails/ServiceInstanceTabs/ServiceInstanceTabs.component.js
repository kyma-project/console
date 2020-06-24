import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import { GenericDocumentation } from '@kyma-project/generic-documentation';
import { DOCUMENTATION_PER_PLAN_LABEL } from 'helpers/constants';

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

const ServiceInstanceTabs = ({ serviceClass, currentPlan }) => {
  const { labels } = serviceClass;
  const isAPIpackage =
    labels && labels[DOCUMENTATION_PER_PLAN_LABEL] === 'true';

  const assetGroup = isAPIpackage
    ? currentPlan.assetGroup || currentPlan.clusterAssetGroup
    : serviceClass.assetGroup || serviceClass.clusterAssetGroup;

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
  currentPlan: PropTypes.shape({
    assetGroup: PropTypes.object,
    clusterAssetGroup: PropTypes.object,
  }),
};

export default ServiceInstanceTabs;
