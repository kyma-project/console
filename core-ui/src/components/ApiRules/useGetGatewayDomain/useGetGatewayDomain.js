import React from 'react';
import { useGet } from 'react-shared';

const apiGatewayUri =
  '/apis/networking.istio.io/v1beta1/namespaces/kyma-system/gateways/kyma-gateway';

export function useGetGatewayDomain() {
  const [domain, setDomain] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const { error: getError, loading: getLoading, data } = useGet(
    apiGatewayUri,
    {},
  );
  React.useEffect(() => {
    setError(getError);
    setLoading(getLoading);
    setDomain(data?.spec.servers[0].hosts[0].replace('*.', '') || '');
  }, [getError, getLoading, data]);

  return { domain, loading, error };
}
