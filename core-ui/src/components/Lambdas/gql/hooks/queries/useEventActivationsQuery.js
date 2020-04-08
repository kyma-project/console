import { useState, useEffect } from 'react';
import { useNotification } from 'react-shared';
import { useQuery } from '@apollo/react-hooks';

import { GET_EVENT_ACTIVATIONS } from 'components/Lambdas/gql/queries';

import { extractEventsFromEventActivations } from 'components/Lambdas/helpers/eventTriggers';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_QUERIES } from 'components/Lambdas/constants';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

export const useEventActivationsQuery = ({ namespace }) => {
  const [events, setEvents] = useState([]);
  const notificationManager = useNotification();

  const { data, error, loading } = useQuery(GET_EVENT_ACTIVATIONS, {
    variables: {
      namespace,
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data && data.eventActivations) {
      const events = extractEventsFromEventActivations(data.eventActivations);
      setEvents(events);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const errorToDisplay = extractGraphQlErrors(error);

      const message = formatMessage(
        GQL_QUERIES.EVENT_ACTIVATIONS.ERROR_MESSAGE,
        {
          namespace,
          error: errorToDisplay,
        },
      );

      notificationManager.notifyError({
        content: message,
        autoClose: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return [events, error, loading];
};
