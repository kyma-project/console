import React from 'react';
import PropTypes from 'prop-types';

import { Toolbar } from '@kyma-project/react-components';

const ServiceClassToolbar = ({
  arrayOfJsx,
  renObjData,
  history,
  serviceClassDisplayName,
  children,
}) => {
  return (
    <div>
      <div> {arrayOfJsx} </div>
      {renObjData}

      <Toolbar
        back={() => {
          history.goBack();
        }}
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
