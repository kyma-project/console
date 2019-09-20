import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

// import { GenericComponent } from '@kyma-project/generic-documentation';

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
  const docsTopic =
    serviceClass && (serviceClass.docsTopic || serviceClass.clusterDocsTopic);

  return <div>GENERICDOCUCOMPONENT</div>;

  // return (
  //   <GenericComponent
  //     docsTopic={docsTopic}
  //     layout="instances-ui"
  //     tabRouteHandler={tabRouteHandler}
  //   />
  // );
};

ServiceInstanceTabs.propTypes = {
  serviceClass: PropTypes.object.isRequired,
};

export default ServiceInstanceTabs;
