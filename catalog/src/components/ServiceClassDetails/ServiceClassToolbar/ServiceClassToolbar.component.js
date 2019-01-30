import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Toolbar } from '@kyma-project/react-components';

const ServiceClassToolbar = ({
  history,
  serviceClassDisplayName,
  children,
}) => {
  const goToServiceInstanceList = () => {
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate('/');
  };

  return (
    <Toolbar 
      goBack={goToServiceInstanceList} 
      title={serviceClassDisplayName}
    >
      {children}
    </Toolbar>
  );
};

ServiceClassToolbar.propTypes = {
  arrayOfJsx: PropTypes.any,
  renObjData: PropTypes.any,
  serviceClassDisplayName: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  history: PropTypes.object.isRequired,
};

export default ServiceClassToolbar;
