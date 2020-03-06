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

function filterServiceInstances(instances, currentPlan) {
  if (!currentPlan) {
    return instances;
  }

  return instances.filter(instance => {
    const servicePlan =
      (instance && (instance.servicePlan || instance.clusterServicePlan)) || [];
    return servicePlan.name === currentPlan.name;
  });
}

const ServiceClassTabs = ({ serviceClass, currentPlan }) => {
  const assetGroup =
    serviceClass && (serviceClass.assetGroup || serviceClass.clusterAssetGroup);

  const instances = currentPlan
    ? filterServiceInstances(serviceClass.instances, currentPlan)
    : serviceClass.instances;
  const additionalTabs = instances.length
    ? [
        {
          label: (
            <>
              <span>{serviceClassConstants.instancesTabText}</span>
              {getTabElementsIndicator(instances.length)}
            </>
          ),
          children: <ServiceClassInstancesTable tableData={instances} />,
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
};

export default ServiceClassTabs;
