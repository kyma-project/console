import React from 'react';
import ServiceInstanceUpperBar from './../ServiceInstanceUpperBar/ServiceInstanceUpperBar.component';
import ServiceInstanceInfo from './../ServiceInstanceInfo/ServiceInstanceInfo.component';
import { ServiceClassDescription } from './styled';

import {
  Toolbar,
} from '@kyma-project/react-components';
import styled from 'styled-components';

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
      />
      <ServiceInstanceInfo serviceInstance={serviceInstance} />
    </div>
  );
};

export default ServiceInstanceToolbar;
/* todo labelele */
/* todo moze dodać margin: 0 dla wszystkich Element ów? */