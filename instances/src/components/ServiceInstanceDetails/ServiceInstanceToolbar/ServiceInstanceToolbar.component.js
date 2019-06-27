import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import ServiceInstanceUpperBar from './../ServiceInstanceUpperBar/ServiceInstanceUpperBar.component';

import {
  Toolbar,
} from '@kyma-project/react-components';

// import {
//   ServiceInstanceToolbarHeadline,
//   ServiceInstanceToolbarHeadlineLink,
//   UpperBarWrapper
// } from './styled';
// import { styled } from '@kyma-project/asyncapi-react/lib/theme';

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

  // const toolbarTitle = (
  //   <ServiceInstanceToolbarHeadline>
  //     <ServiceInstanceToolbarHeadlineLink onClick={goToServiceInstances}>
  //       Service Instances
  //     </ServiceInstanceToolbarHeadlineLink>{' '}
  //     / {serviceInstance.name}
  //   </ServiceInstanceToolbarHeadline>
  // );

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
    </div>
  );
};

export default ServiceInstanceToolbar;
