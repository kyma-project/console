import React from 'react';
import PropTypes from 'prop-types';
import { Status, StatusWrapper } from '@kyma-project/react-components';
import { GenericComponent } from '@kyma-project/generic-documentation';
import LuigiClient from '@kyma-project/luigi-client';

import { ServiceClassInstancesTable } from '../ServiceClassInstancesTable/ServiceClassInstancesTable.component';
import { serviceClassConstants } from '../../../variables';

function getTabElementsIndicator(instancesCount) {
  return (
    <StatusWrapper
      key="instances-no"
      style={{
        float: 'right',
      }}
    >
      <Status>{instancesCount}</Status>
    </StatusWrapper>
  );
}

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

const ServiceClassTabs = ({ serviceClass }) => {
  const docsTopic =
    serviceClass && (serviceClass.docsTopic || serviceClass.clusterDocsTopic);

  const additionalTabs = serviceClass.instances.length
    ? [
        {
          label: (
            <>
              <span>{serviceClassConstants.instancesTabText}</span>
              {getTabElementsIndicator(serviceClass.instances.length)}
            </>
          ),
          content: (
            <ServiceClassInstancesTable tableData={serviceClass.instances} />
          ),
          id: serviceClassConstants.instancesTabText,
        },
      ]
    : [];

  return (
    <GenericComponent
      docsTopic={docsTopic}
      additionalTabs={additionalTabs}
      layout="catalog-ui"
      tabRouteHandler={tabRouteHandler}
    />
  );
};

ServiceClassTabs.propTypes = {
  serviceClass: PropTypes.object.isRequired,
};

export default ServiceClassTabs;
