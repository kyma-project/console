import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Toolbar } from '@kyma-project/react-components';

const ServiceClassToolbar = ({
  arrayOfJsx,
  renObjData,
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
    <div>
      <div> {arrayOfJsx} </div>
      {renObjData}

      <Toolbar
        back={goToServiceInstanceList}
        headline={serviceClassDisplayName}
        addSeparator
      >
        {children}
      </Toolbar>
    </div>
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
