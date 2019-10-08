import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { GET_LAMBDAS } from '../../gql/queries';
import { DELETE_LAMBDA } from '../../gql/mutations';

import {
  POLL_INTERVAL,
  EMPTY_TEXT_PLACEHOLDER,
} from './../../shared/constants';

import { Token } from 'fundamental-react/Token';
import { Spinner } from '@kyma-project/react-components';
import GenericList from '../../shared/components/GenericList/GenericList';
import LambdaStatusBadge from '../../shared/components/StatusBadge/LambdaStatusBadge';

export default function Lambdas() {
  const { data, error, loading } = useQuery(GET_LAMBDAS, {
    variables: {
      namespace: 'functions',
    },
    pollInterval: POLL_INTERVAL,
  });

  const [deleteLambda] = useMutation(DELETE_LAMBDA);

  const handleLambdaDelete = (name, namespace) => {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: `Remove ${name}`,
        body: `Are you sure you want to delete lambda "${name}"?`,
        buttonConfirm: 'Delete',
        buttonDismiss: 'Cancel',
      })
      .then(async () => {
        try {
          await deleteLambda({
            variables: { name: name, namespace: namespace },
          });
        } catch (e) {
          console.warn(e);
          LuigiClient.uxManager().showAlert({
            text: e.message,
            type: 'error',
            closeAfter: 10000,
          });
        }
      })
      .catch(() => {});
  };

  const actions = [
    {
      name: 'Delete',
      handler: entry => {
        console.log('delete');
        handleLambdaDelete(entry.name, entry.namespace);
      },
    },
  ];

  const createLabels = labels => {
    const separatedLabels = [];
    /* eslint-disable no-unused-vars */
    for (const key in labels) {
      separatedLabels.push(key + '=' + labels[key]);
    }

    /* eslint-enable no-unused-vars */
    return separatedLabels.map((label, id) => (
      <Token
        key={id}
        className="y-fd-token y-fd-token--no-button y-fd-token--gap"
      >
        {label}
      </Token>
    ));
  };

  const headerRenderer = () => ['Name', 'Runtime', 'Labels', 'Status'];

  const rowRenderer = item => [
    <span className="link">{item.name}</span>,
    <span>{item.runtime}</span>,
    item.labels && Object.keys(item.labels).length
      ? createLabels(item.labels)
      : EMPTY_TEXT_PLACEHOLDER,
    <LambdaStatusBadge status={item.status} />,
  ];

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <Spinner />;
  }
  console.log('data', data);

  return (
    <GenericList
      title="Lambdas"
      description="List of lambdas"
      actions={actions}
      entries={data.functions}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
    />
  );
}
