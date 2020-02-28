import React from 'react';
import PropTypes from 'prop-types';

import { Spinner } from 'react-shared';

import { ServiceBindingsService } from './ServiceBindingsService';
import ServiceBindings from './ServiceBindings';

export default function ServiceBindingsWrapper({
  lambda: { name, serviceBindingUsages = [] },
  refetchLambda,
}) {
  return (
    <ServiceBindingsService lambdaName={name}>
      <ServiceBindings
        serviceBindingUsages={serviceBindingUsages}
        refetchLambda={refetchLambda}
      />
    </ServiceBindingsService>
  );
}

ServiceBindingsWrapper.propTypes = {
  lambda: PropTypes.object.isRequired,
  refetchLambda: PropTypes.func.isRequired,
};
