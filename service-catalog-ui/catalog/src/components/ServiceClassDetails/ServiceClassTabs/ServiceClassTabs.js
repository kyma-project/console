import React from 'react';
import PropTypes from 'prop-types';
import { Status, StatusWrapper } from '@kyma-project/react-components';
import { GenericDocumentation } from '@kyma-project/generic-documentation';

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

const ServiceClassTabs = ({ serviceClass, preselectedPlan }) => {
  const assetGroup = preselectedPlan
    ? preselectedPlan.assetGroup || preselectedPlan.clusterAssetGroup
    : serviceClass.assetGroup || serviceClass.clusterAssetGroup;

  const additionalTabs = serviceClass.instances.length
    ? [
        {
          label: (
            <>
              <span>{serviceClassConstants.instancesTabText}</span>
              {getTabElementsIndicator(serviceClass.instances.length)}
            </>
          ),
          children: (
            <ServiceClassInstancesTable tableData={serviceClass.instances} />
          ),
          id: serviceClassConstants.instancesTabText,
        },
      ]
    : [];

  return (
    <GenericDocumentation
      assetGroup={assetGroup}
      additionalTabs={additionalTabs}
      layout="catalog-ui"
    />
  );
};

ServiceClassTabs.propTypes = {
  serviceClass: PropTypes.object.isRequired,
  preselectedPlan: PropTypes.object,
};

export default ServiceClassTabs;
