import { useEffect } from 'react';
import { useNotification } from 'react-shared';
import { useGet } from 'react-shared';

import {
  formatMessage,
  formatMessage as injectVariables,
} from 'components/Lambdas/helpers/misc';
import { GQL_QUERIES, SERVICE_URL } from 'components/Lambdas/constants';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

export const useServiceQuery = ({ name, namespace }) => {
  const notificationManager = useNotification();

  const { data, error, loading } = useGet(
    injectVariables(SERVICE_URL, {
      namespace: namespace,
      name: name,
    }),
    { pollingInterval: 3000 },
  );
  const service = data;

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
