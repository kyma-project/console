import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';

import { CREATE_MANY_EVENT_TRIGGERS } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import {
  createSubscriberRef,
  createOwnerRef,
} from 'components/Lambdas/helpers/eventTriggers';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import {
  TRIGGER_SUBSCRIBER,
  GQL_MUTATIONS,
} from 'components/Lambdas/constants';

export const useCreateManyEventTriggers = ({
  lambda = {
    name: '',
    namespace: '',
  },
}) => {
  const notificationManager = useNotification();
  const [createManyEventTriggersMutation] = useMutation(
    CREATE_MANY_EVENT_TRIGGERS,
  );

  function handleError(error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(
      GQL_MUTATIONS.CREATE_MANY_TRIGGERS.ERROR_MESSAGE,
      {
        lambdaName: lambda.name,
        error: errorToDisplay,
      },
    );

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  function prepareEventTriggersInput(events) {
    const subscriber = createSubscriberRef(lambda);

    return events.map(event => ({
      namespace: lambda.namespace,
      broker: TRIGGER_SUBSCRIBER.BROKER,
      filterAttributes: {
        type: event.eventType,
        eventtypeversion: event.version,
        source: event.source,
      },
      subscriber,
    }));
  }

  async function createManyEventTriggers(events) {
    const ownerRef = createOwnerRef(lambda);
    const triggers = prepareEventTriggersInput(events);

    try {
      const response = await createManyEventTriggersMutation({
        variables: {
          triggers,
          ownerRef: [ownerRef],
        },
      });

      if (response.error) {
        handleError(response.error);
        return;
      }

      notificationManager.notifySuccess({
        content: GQL_MUTATIONS.CREATE_MANY_TRIGGERS.SUCCESS_MESSAGE,
      });
    } catch (err) {
      handleError(err);
    }
  }

  return createManyEventTriggers;
};
