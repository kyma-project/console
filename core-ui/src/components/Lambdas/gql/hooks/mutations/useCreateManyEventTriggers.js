import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';

import { CREATE_MANY_EVENT_TRIGGERS } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import {
  createSubscriberRef,
  createOwnerRef,
} from 'components/Lambdas/helpers/eventTriggers';
import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS } from 'components/Lambdas/constants';
import { CONFIG } from 'components/Lambdas/config';

export const useCreateManyEventTriggers = ({
  // lambda = {
  //   name: '',
  //   namespace: '',
  // },
  name,
  namespace,
  subscriberRef,
}) => {
  const notificationManager = useNotification();
  const [createManyEventTriggersMutation] = useMutation(
    CREATE_MANY_EVENT_TRIGGERS,
  );

  function handleError(error, isSingleTrigger) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = isSingleTrigger
      ? GQL_MUTATIONS.CREATE_TRIGGERS.ERROR_MESSAGE_SINGLE
      : GQL_MUTATIONS.CREATE_TRIGGERS.ERROR_MESSAGE_MANY;

    const formattedMessage = formatMessage(message, {
      lambdaName: name,
      error: errorToDisplay,
    });

    notificationManager.notifyError({
      content: formattedMessage,
      autoClose: false,
    });
  }

  function prepareEventTriggersInput(events) {
    return events.map(event => {
      const trigger = {
        namespace,
        broker: CONFIG.triggerSubscriber.broker,
        filterAttributes: {
          type: event.eventType,
          source: event.source,
        },
        subscriber: subscriberRef,
      };

      // version doesn't have to be
      if (event.version) {
        trigger.filterAttributes.eventtypeversion = event.version;
      }

      return trigger;
    });
  }

  async function createManyEventTriggers(events) {
    const ownerRef = createOwnerRef(lambda);
    const triggers = prepareEventTriggersInput(events);
    const isSingleTrigger = triggers.length === 1;

    try {
      const response = await createManyEventTriggersMutation({
        variables: {
          namespace: namespace,
          triggers,
          ownerRef: [ownerRef],
        },
      });

      if (response.error) {
        handleError(response.error, isSingleTrigger);
        return;
      }

      const message = isSingleTrigger
        ? GQL_MUTATIONS.CREATE_TRIGGERS.SUCCESS_MESSAGE_SINGLE
        : GQL_MUTATIONS.CREATE_TRIGGERS.SUCCESS_MESSAGE_MANY;

      notificationManager.notifySuccess({
        content: message,
      });
    } catch (err) {
      handleError(err, isSingleTrigger);
    }
  }

  return createManyEventTriggers;
};
