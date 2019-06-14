import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Toolbar } from '@kyma-project/react-components';

const ServiceClassToolbar = ({
  serviceClassDisplayName,
  providerDisplayName,
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
      description={providerDisplayName}
      background="#fff"
    >
      {children}
    </Toolbar>
  );
};

ServiceClassToolbar.propTypes = {
  serviceClassDisplayName: PropTypes.string.isRequired,
  providerDisplayName: PropTypes.string,
};

export default ServiceClassToolbar;
