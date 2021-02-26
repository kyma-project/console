import React from 'react';

import ServiceBindings from './ServiceBindings';
import { Spinner, useGetList } from 'react-shared';
import { CONFIG } from 'components/Lambdas/config.js';

export default function ServiceBindingsWrapper({
  lambda,
  setBindingUsages = () => void 0, // might be needed for other Lambda subcomponents
}) {
  const isBindingUsageForThisFunction = bindingUsage =>
    bindingUsage.spec.usedBy.kind === CONFIG.functionUsageKind &&
    bindingUsage.spec.usedBy.name === lambda.metadata.name;

  const bindingsRequest = useGetList()(
    `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${lambda?.metadata.namespace}/servicebindings`,
    {
      pollingInterval: 3100,
    },
  );

  const bindingUsagesRequest = useGetList()(
    `/apis/servicecatalog.kyma-project.io/v1alpha1/namespaces/${lambda?.metadata.namespace}/servicebindingusages`,
    {
      pollingInterval: 2900,
    },
  );

  const secretsRequest = useGetList()(
    `/api/v1/namespaces/${lambda?.metadata.namespace}/secrets`,
    {
      pollingInterval: 3300,
    },
  );

  if (
    !bindingsRequest.data ||
    !bindingUsagesRequest.data ||
    !secretsRequest.data
  )
    return <Spinner />; //TODO

  const getBindingCombinedData = binding => {
    const usage = bindingUsagesRequest.data.find(
      u =>
        binding.metadata.name === u.spec.serviceBindingRef.name &&
        isBindingUsageForThisFunction(u),
    );
    return {
      serviceBinding: binding,
      serviceBindingUsage: usage,
      secret: binding
        ? secretsRequest.data.find(
            s => s.metadata.name === binding.spec.secretName,
          )
        : undefined,
    };
  };

  const serviceBindingsCombined = bindingsRequest.data.map(
    getBindingCombinedData,
  );

  const error = !!(
    bindingsRequest.error ||
    bindingUsagesRequest.error ||
    secretsRequest.error
  );
  const loading = !!(
    bindingsRequest.loading ||
    bindingUsagesRequest.loading ||
    secretsRequest.loading
  );

  return (
    <ServiceBindings
      lambda={lambda}
      serviceBindingsCombined={serviceBindingsCombined}
      serverDataError={error}
      serverDataLoading={loading}
    />
  );
}
