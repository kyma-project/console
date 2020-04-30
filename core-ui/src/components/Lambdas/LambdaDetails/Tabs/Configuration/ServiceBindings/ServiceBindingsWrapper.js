import React, { useEffect } from 'react';

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
    <ServiceBindings
      lambda={lambda}
      serviceBindingUsages={bindingUsages}
      serverDataError={error || false}
      serverDataLoading={loading || false}
    />
  );
}
