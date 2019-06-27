import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import ServiceInstanceUpperBar from './../ServiceInstanceUpperBar/ServiceInstanceUpperBar.component';
import ServiceInstanceInfo from './../ServiceInstanceInfo/ServiceInstanceInfo.component';

import {
  Toolbar,
} from '@kyma-project/react-components';

const ServiceInstanceToolbar = ({
  serviceInstance,
  deleteServiceInstance,
  history,
}) => {

  const instanceClass =
    serviceInstance &&
    (serviceInstance.clusterServiceClass
      ? serviceInstance.clusterServiceClass
      : serviceInstance.serviceClass);

  return (
    <div style={{ backgroundColor: 'white' }}>
      <ServiceInstanceUpperBar 
          serviceInstance={serviceInstance}
          deleteServiceInstance={deleteServiceInstance}
          history={history}/>
      <Toolbar
        title={serviceInstance.name}
        description={instanceClass && instanceClass.description}
      />
      <ServiceInstanceInfo serviceInstance={serviceInstance} />
    </div>
  );
};

export default ServiceInstanceToolbar;
/*todo font jasnoszarego opisu na 16px*/