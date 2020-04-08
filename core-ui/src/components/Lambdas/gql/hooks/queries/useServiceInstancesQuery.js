import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GET_SERVICE_INSTANCES } from 'components/Lambdas/gql/queries';

import { filterServiceInstances } from 'components/Lambdas/helpers/serviceBindingUsages';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_QUERIES } from 'components/Lambdas/constants';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

export const useServiceInstancesQuery = ({
  namespace,
  serviceBindingUsages = [],
}) => {
  const [serviceInstances, setServiceInstances] = useState([]);
  const [serviceInstancesError, setServiceInstancesError] = useState(null);

  const { data, error, loading, refetch } = useQuery(GET_SERVICE_INSTANCES, {
    variables: {
      namespace,
      status: 'RUNNING',
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data && data.serviceInstances) {
      const instances = filterServiceInstances(
        data.serviceInstances,
        serviceBindingUsages,
      );
      setServiceInstances(instances);
    }
  }, [data, serviceBindingUsages]);

  useEffect(() => {
    if (error) {
      const errorToDisplay = extractGraphQlErrors(error);
      const message = formatMessage(
        GQL_QUERIES.SERVICE_INSTANCES.ERROR_MESSAGE,
        {
          error: errorToDisplay,
        },
      );
      setServiceInstancesError(message);
    }
  }, [error, setServiceInstancesError]);

  return {
    serviceInstances,
    error: serviceInstancesError,
    loading,
    refetchServiceInstances: refetch,
  };
};
