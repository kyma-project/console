import { useEffect, useState } from 'react';
import { useNotification } from 'react-shared';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import { GET_API_RULES } from 'gql/queries';
import { API_RULE_EVENT_SUBSCRIPTION } from 'gql/subscriptions';

import {
  useQueue,
  useStateWithCallback,
} from 'components/Lambdas/helpers/hooks';
import {
  formatMessage,
  handleSubscriptionEvent,
} from 'components/Lambdas/helpers/misc';
import { GQL_QUERIES } from '../constants';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

export const useApiRulesQuery = ({ namespace, serviceName = undefined }) => {
  const notificationManager = useNotification();
  const [loadedData, setLoadedData] = useState(false);
  const [apiRules, setApiRules] = useStateWithCallback([]);
  const apolloClient = useApolloClient();

  useEffect(() => {
    setLoadedData(false);
  }, [namespace]);

  function processQueue(event, done) {
    const newApiRules = handleSubscriptionEvent(
      {
        type: event.type,
        newItem: event.apiRule,
      },
      apiRules,
    );
    setApiRules(newApiRules, () => {
      done();
    });
  }
  const [addToQueue] = useQueue(processQueue);

  const variables = {
    namespace,
    serviceName,
  };

  const { error, loading } = useQuery(GET_API_RULES, {
    variables,
    fetchPolicy: 'no-cache',
    onCompleted,
    onError,
  });

  useEffect(() => {
    const observer = apolloClient.subscribe({
      query: API_RULE_EVENT_SUBSCRIPTION,
      variables,
    });

    const subscription = observer.subscribe(({ data }) => {
      if (data && data.apiRuleEvent) {
        addToQueue(data.apiRuleEvent);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, serviceName]);

  function onCompleted(data) {
    if (!loadedData && data && data.APIRules) {
      setApiRules(data.APIRules);
      setLoadedData(true);
    }
  }

  function onError(error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(GQL_QUERIES.API_RULES.ERROR_MESSAGE, {
      error: errorToDisplay,
    });

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  return {
    apiRules,
    error,
    loading,
  };
};
