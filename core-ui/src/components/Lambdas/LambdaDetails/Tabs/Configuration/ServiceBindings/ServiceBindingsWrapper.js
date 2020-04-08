import React from 'react';
import PropTypes from 'prop-types';

import { ServiceBindingsService } from './ServiceBindingsService';
import ServiceBindings from './ServiceBindings';

export default function ServiceBindingsWrapper({ lambda, refetchLambda }) {
  return (
    <ServiceBindingsService lambdaName={lambda.name}>
      <ServiceBindings lambda={lambda} refetchLambda={refetchLambda} />
    </ServiceBindingsService>
  );
}

ServiceBindingsWrapper.propTypes = {
  lambda: PropTypes.object.isRequired,
  refetchLambda: PropTypes.func.isRequired,
};
