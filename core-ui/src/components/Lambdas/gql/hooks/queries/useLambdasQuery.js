import { useEffect, useState } from 'react';
import { useNotification } from 'react-shared';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import { GET_LAMBDAS } from 'components/Lambdas/gql/queries';
import { LAMBDA_EVENT_SUBSCRIPTION } from 'components/Lambdas/gql/subscriptions';

import {
  useQueue,
  useStateWithCallback,
} from 'components/Lambdas/helpers/hooks';
import {
  formatMessage,
  handleSubscriptionEvent,
} from 'components/Lambdas/helpers/misc';
import { GQL_QUERIES } from 'components/Lambdas/constants';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

export const useLambdasQuery = ({ namespace }) => {
  const notificationManager = useNotification();
  const [loadedData, setLoadedData] = useState(false);
  const [lambdas, setLambdas] = useStateWithCallback([]);
  const [repositories, setRepositories] = useStateWithCallback([]);
  const apolloClient = useApolloClient();

  function processQueue(event, done) {
    const newLambdas = handleSubscriptionEvent(
      {
        type: event.type,
        newItem: event.function,
      },
      lambdas,
    );
    setLambdas(newLambdas, () => {
      done();
    });
  }
  const [addToQueue] = useQueue(processQueue);

  const variables = {
    namespace,
  };

  const { data, error, loading, refetch } = useQuery(GET_LAMBDAS, {
    variables,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data && data.functions) {
      setLambdas(data.functions);
      setRepositories(data.gitRepositories);
      setLoadedData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const observer = apolloClient.subscribe({
      query: LAMBDA_EVENT_SUBSCRIPTION,
      variables,
    });

    const subscription = observer.subscribe(({ data }) => {
      if (data && data.functionEvent) {
        addToQueue(data.functionEvent);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace]);

  useEffect(() => {
    if (error) {
      const errorToDisplay = extractGraphQlErrors(error);

      const message = formatMessage(GQL_QUERIES.LAMBDAS.ERROR_MESSAGE, {
        namespace,
        error: errorToDisplay,
      });

      notificationManager.notifyError({
        content: message,
        autoClose: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    lambdas,
    repositories,
    error,
    loading,
    loadedData,
    refetch,
  };
};
