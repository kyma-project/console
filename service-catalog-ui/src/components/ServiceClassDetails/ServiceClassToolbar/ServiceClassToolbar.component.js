import React from 'react';
import PropTypes from 'prop-types';

import { Toolbar } from '@kyma-project/react-components';

const ServiceClassToolbar = ({
  serviceClassDisplayName,
  providerDisplayName,
  children,
}) => {
  return (
    <Toolbar
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
