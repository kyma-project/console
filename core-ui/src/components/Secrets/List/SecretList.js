import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import {
  GenericList,
  PageHeader,
  handleDelete,
  useNotification,
  handleSubscriptionArrayEvent,
  Labels,
} from 'react-shared';
import { Link } from 'fundamental-react';

import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { GET_SECRETS_LIST } from 'gql/queries';
import { DELETE_SECRET } from 'gql/mutations';
import { SECRET_EVENT_SUBSCRIPTION_LIST } from 'gql/subscriptions';

import { SECRETS_TITLE } from 'shared/constants';

SecretList.propTypes = { namespace: PropTypes.string.isRequired };

function goToSecretDetails(name) {
  LuigiClient.linkManager().navigate(`details/${name}`);
}

export default function SecretList({ namespace }) {
  const notificationManager = useNotification();

  const [secrets, setSecrets] = React.useState([]);

  const { data, loading, error } = useQuery(GET_SECRETS_LIST, {
    fetchPolicy: 'cache-and-network',
    variables: { namespace },
    onCompleted: data => setSecrets(data.secrets),
  });

  useSubscription(SECRET_EVENT_SUBSCRIPTION_LIST, {
    variables: { namespace },
    onSubscriptionData: ({ subscriptionData }) => {
      const { type, secret } = subscriptionData.data.secretEvent;
      handleSubscriptionArrayEvent(secrets, setSecrets, type, secret);
    },
  });

  const [deleteSecret] = useMutation(DELETE_SECRET);

  const headerRenderer = () => ['Name', 'Type', 'Age', 'Labels'];

  const rowRenderer = secret => [
    <Link className="link" onClick={() => goToSecretDetails(secret.name)}>
      {secret.name}
    </Link>,
    secret.type,
    <Moment unix fromNow>
      {secret.creationTime}
    </Moment>,
    <Labels labels={secret.labels} />,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: entry =>
        handleDelete(
          'Secret',
          entry.name,
          entry.name,
          () => deleteSecret({ variables: { namespace, name: entry.name } }),
          () =>
            notificationManager.notifySuccess({
              content: `Secret ${entry.name} deleted`,
            }),
        ),
    },
  ];

  return (
    <>
      <PageHeader title={SECRETS_TITLE} />
      <GenericList
        notFoundMessage="There are no secrets in this Namespace"
        actions={actions}
        entries={secrets || data.secrets}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        serverDataLoading={loading}
        serverDataError={error}
        textSearchProperties={['name', 'spec.secretName']}
      />
    </>
  );
}
