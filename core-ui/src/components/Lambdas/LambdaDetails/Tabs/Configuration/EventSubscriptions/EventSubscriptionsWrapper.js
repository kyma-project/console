import React from 'react';
import PropTypes from 'prop-types';
import {
  useGetList,
  Spinner,
  usePost,
  useNotification,
  useDelete,
} from 'react-shared';
import EventSubscriptions from 'shared/components/EventSubscriptions/EventSubscriptions';
import {
  SERVERLESS_API_VERSION,
  SERVERLESS_RESOURCE_KIND,
} from '../../../../constants';
import { randomNamesGenerator } from '@kyma-project/common';
import { createSubscriptionInput } from './createSubscriptionInput';

export default function EventSubscriptionsWrapper({ lambda }) {
  const notificationManager = useNotification();
  const postRequest = usePost();
  const deleteRequest = useDelete();

  const subscriptionsUrl = `/apis/eventing.kyma-project.io/v1alpha1/namespaces/${lambda.metadata.namespace}/subscriptions`;

  const ownerRef = {
    apiVersion: SERVERLESS_API_VERSION,
    kind: SERVERLESS_RESOURCE_KIND,
    name: lambda.metadata.name,
    uid: lambda.metadata.uid,
  };

  const filterByOwnerRef = ({ metadata }) =>
    metadata.ownerReferences?.find(
      ref =>
        ref.kind === SERVERLESS_RESOURCE_KIND &&
        ref.name === lambda.metadata.name,
    );

  const {
    data: subscriptions = [],
    error,
    loading,
    silentRefetch,
  } = useGetList(filterByOwnerRef)(subscriptionsUrl, {
    pollingInterval: 3000,
  });

  async function handleSubscriptionAdded(eventType) {
    const name = `${lambda.metadata.name}-${randomNamesGenerator()}`;
    const sink = `http://${lambda.metadata.name}.${lambda.metadata.namespace}.svc.cluster.local`;
    const subscriptionInput = createSubscriptionInput(
      name,
      lambda,
      ownerRef,
      sink,
      eventType,
    );

    try {
      await postRequest(`${subscriptionsUrl}/${name}`, subscriptionInput);
      silentRefetch();

      notificationManager.notifySuccess({
        content: 'Subscription created succesfully',
      });
    } catch (err) {
      console.error(err);
      notificationManager.notifyError({
        content: err.message,
        autoClose: false,
      });
    }
  }

  async function handleSubscriptionDelete(s) {
    try {
      await deleteRequest(`${subscriptionsUrl}/${s.metadata.name}`); //TODO use selfLink which is not there; why?

      notificationManager.notifySuccess({
        content: 'Subscription removed succesfully',
      });
    } catch (err) {
      console.error(err);
      notificationManager.notifyError({
        content: err.message,
        autoClose: false,
      });
    }
  }

  if (!subscriptions) return <Spinner />;

  return (
    <EventSubscriptions
      isLambda={true}
      onSubscriptionDelete={handleSubscriptionDelete}
      onSubscriptionAdd={handleSubscriptionAdded}
      subscriptions={subscriptions || []}
      serverDataError={error || false}
      serverDataLoading={loading || false}
    />
  );
}
EventSubscriptionsWrapper.propTypes = {
  lambda: PropTypes.shape({
    metadata: PropTypes.shape({
      name: PropTypes.string,
      namespace: PropTypes.string,
    }),
  }).isRequired,
};
