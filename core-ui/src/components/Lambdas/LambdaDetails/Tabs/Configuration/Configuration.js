import React from 'react';
import PropTypes from 'prop-types';

import ConfigurationForm from './ConfigurationForm/ConfigurationForm';
import ServiceBindingsWrapper from './ServiceBindings/ServiceBindingsWrapper';

const ConfigurationTab = props => {
  return (
    <>
      <ConfigurationForm {...props} />
      <ServiceBindingsWrapper
        lambda={props.lambda}
        refetchLambda={props.refetchLambda}
      />
    </>
  );
};

ConfigurationTab.propTypes = {
  lambda: PropTypes.object.isRequired,
  refetchLambda: PropTypes.func.isRequired,
  formRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  sizeRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  runtimeRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  LabelsEditor: PropTypes.element.isRequired,
};

export default ConfigurationTab;
