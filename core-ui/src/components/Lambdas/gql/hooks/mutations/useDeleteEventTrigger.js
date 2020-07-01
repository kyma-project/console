import LuigiClient from '@luigi-project/client';
import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';

import { DELETE_ONE_EVENT_TRIGGER } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS, BUTTONS } from 'components/Lambdas/constants';

export const useDeleteEventTrigger = ({ name }, mutationOptions = {}) => {
  const notificationManager = useNotification();
  const [deleteEventTriggerMutation] = useMutation(
    DELETE_ONE_EVENT_TRIGGER,
    mutationOptions,
  );

  function handleError(eventTrigger, error) {
    const eventTriggerName = processTriggerName(eventTrigger);
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(GQL_MUTATIONS.DELETE_TRIGGER.ERROR_MESSAGE, {
      triggerName: eventTriggerName,
      lambdaName: name,
      error: errorToDisplay,
    });

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  async function handleDeleteEventTrigger(eventTrigger) {
    const variables = {
      namespace: eventTrigger.namespace,
      trigger: {
        name: eventTrigger.name,
        namespace: eventTrigger.namespace,
      },
    };

    try {
      const response = await deleteEventTriggerMutation({
        variables,
      });

      if (response.error) {
        handleError(eventTrigger, response.error);
        return;
      }

      notificationManager.notifySuccess({
        content: GQL_MUTATIONS.DELETE_TRIGGER.SUCCESS_MESSAGE,
      });
    } catch (err) {
      handleError(eventTrigger, err);
    }
  }

  async function deleteEventTrigger(eventTrigger) {
    if (!eventTrigger) {
      throw Error('Event Trigger is nil');
    }

    const eventTriggerName = processTriggerName(eventTrigger);
    const message = formatMessage(
      GQL_MUTATIONS.DELETE_TRIGGER.CONFIRM_MODAL.MESSAGE,
      {
        triggerName: eventTriggerName,
        lambdaName: name,
      },
    );

    LuigiClient.uxManager()
      .showConfirmationModal({
        header: GQL_MUTATIONS.DELETE_TRIGGER.CONFIRM_MODAL.TITLE,
        body: message,
        buttonConfirm: BUTTONS.DELETE,
        buttonDismiss: BUTTONS.CANCEL,
      })
      .then(() => handleDeleteEventTrigger(eventTrigger))
      .catch(() => {});
  }

  return deleteEventTrigger;
};

export function processTriggerName(eventTrigger) {
  const filterAttributes = eventTrigger.filterAttributes || {};
  return `${filterAttributes.source ||
    ''}/${filterAttributes.eventtypeversion || ''}.${filterAttributes.type ||
    ''}`;
}
