import { useState, useEffect } from 'react';
import { useNotification } from 'react-shared';
import { useQuery } from '@apollo/react-hooks';

import { GET_SERVICE } from 'components/Lambdas/gql/queries';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_QUERIES } from 'components/Lambdas/constants';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

export const useServiceQuery = ({ name, namespace }) => {
  const [service, setService] = useState(undefined);
  const notificationManager = useNotification();

  const { data, error, loading } = useQuery(GET_SERVICE, {
    variables: {
      name,
      namespace,
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data && data.service) {
      setService(data.service);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const errorToDisplay = extractGraphQlErrors(error);

      const message = formatMessage(GQL_QUERIES.SERVICE.ERROR_MESSAGE, {
        serviceName: name,
        error: errorToDisplay,
      });

      notificationManager.notifyError({
        content: message,
        autoClose: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return { service, error, loading };
};
