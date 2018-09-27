import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Toolbar } from '@kyma-project/react-components';

const ServiceClassToolbar = ({
  arrayOfJsx,
  renObjData,
  history,
  clusterServiceClassDisplayName,
  children,
}) => {
  const goToServiceInstanceList = () => {
    LuigiClient.linkManager()
      .fromContext('environment')
      .navigate(`service-catalog`);
  };

  return (
    <div>
      <div> {arrayOfJsx} </div>
      {renObjData}

      <Toolbar
        back={goToServiceInstanceList}
        headline={clusterServiceClassDisplayName}
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
  clusterServiceClassDisplayName: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  history: PropTypes.object.isRequired,
};

export default ServiceClassToolbar;
