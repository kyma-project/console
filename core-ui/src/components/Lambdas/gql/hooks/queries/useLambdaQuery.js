import { useState, useEffect } from 'react';
import { useNotification } from 'react-shared';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import deepEqual from 'deep-equal';

import { GET_LAMBDA } from 'components/Lambdas/gql/queries';
import { LAMBDA_EVENT_SUBSCRIPTION } from 'components/Lambdas/gql/subscriptions';

import { formatMessage, omitTypenames } from 'components/Lambdas/helpers/misc';
import { GQL_QUERIES } from 'components/Lambdas/constants';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

export const useLambdaQuery = ({ name, namespace }) => {
  const notificationManager = useNotification();
  const [lambda, setLambda] = useState(null);
  const apolloClient = useApolloClient();

  const variables = {
    name,
    namespace,
  };

  const { data, error, loading } = useQuery(GET_LAMBDA, {
    variables,
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data.function) {
      const lambdaWithoutTypenames = omitTypenames(data.function);
      setLambda(lambdaWithoutTypenames);
      return;
    }

    // case with changing namespace
    setLambda(null);
  }, [data, setLambda]);

  useEffect(() => {
    const observer = apolloClient.subscribe({
      query: LAMBDA_EVENT_SUBSCRIPTION,
      fetchPolicy: 'no-cache',
      variables: {
        namespace,
        functionName: name,
      },
    });

    const subscription = observer.subscribe(({ data }) => {
      const func = data && data.functionEvent && data.functionEvent.function;
      if (!func) {
        return;
      }

      const lambdaWithoutTypenames = omitTypenames(func);
      const equal = deepEqual(lambda, lambdaWithoutTypenames);
      if (!equal) {
        setLambda(lambdaWithoutTypenames);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lambda]);

  useEffect(() => {
    if (error) {
      const errorToDisplay = extractGraphQlErrors(error);

      const message = formatMessage(GQL_QUERIES.LAMBDA.ERROR_MESSAGE, {
        lambdaName: name,
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
    lambda,
    error,
    loading,
  };
};
