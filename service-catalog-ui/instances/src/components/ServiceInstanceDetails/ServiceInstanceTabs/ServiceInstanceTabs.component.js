import React from 'react';
import PropTypes from 'prop-types';
import { GenericComponent } from '@kyma-project/generic-documentation';

const ServiceInstanceTabs = ({ serviceClass }) => {
  const docsTopic =
    serviceClass && (serviceClass.docsTopic || serviceClass.clusterDocsTopic);

  return <GenericComponent docsTopic={docsTopic} layout="instances-ui" />;
};

ServiceInstanceTabs.propTypes = {
  serviceClass: PropTypes.object.isRequired,
};

export default ServiceInstanceTabs;
