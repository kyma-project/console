import React from 'react';
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
  return (
    <ToolbarWrapper style={{backgroundColor: 'white'}}>
      <ServiceInstanceUpperBar 
          serviceInstance={serviceInstance}
          deleteServiceInstance={deleteServiceInstance}
          history={history}/>
      <Toolbar title={serviceInstance.name} />
      <ServiceInstanceInfo serviceInstance={serviceInstance} />
    </ToolbarWrapper>
  );
};

export default ServiceInstanceToolbar;