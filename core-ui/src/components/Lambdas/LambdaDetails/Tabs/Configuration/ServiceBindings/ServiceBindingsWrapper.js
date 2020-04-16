import React, { useEffect } from 'react';

import { ServiceBindingsService } from './ServiceBindingsService';
import ServiceBindings from './ServiceBindings';
import { useServiceBindingUsagesQuery } from 'components/Lambdas/gql/hooks/queries';

export default function ServiceBindingsWrapper({
  lambda,
  setBindingUsages = () => void 0,
}) {
  const { bindingUsages = [], error, loading } = useServiceBindingUsagesQuery({
    lambda,
  });

  useEffect(() => {
    setBindingUsages(bindingUsages);
  }, [setBindingUsages, bindingUsages]);

  return (
    <ServiceBindingsService lambdaName={lambda.name}>
      <ServiceBindings
        lambda={lambda}
        serviceBindingUsages={bindingUsages}
        serverDataError={error || false}
        serverDataLoading={loading || false}
      />
    </ServiceBindingsService>
  );
}
