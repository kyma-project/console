import React from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import CreateLambdaForm from './CreateLambdaForm/CreateLambdaForm';
import { useQuery, useMutation } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { GET_LAMBDAS } from '../../gql/queries';
import { DELETE_LAMBDA } from '../../gql/mutations';

import { GenericList } from 'react-shared';

import builder from '../../commons/builder';
import { POLL_INTERVAL } from './../../shared/constants';

import { useNotification } from '../../contexts/notifications';
import Spinner from '../../shared/components/Spinner/Spinner';
import LambdaStatusBadge from '../../shared/components/LambdaStatusBadge/LambdaStatusBadge';
import Labels from '../../shared/components/Labels/Labels';

function CreateLambdaModal() {
  return (
    <ModalWithForm
      title="Create new lambda"
      button={{ text: 'Create lambda', glyph: 'add' }}
      id="add-lambda-modal"
      renderForm={props => <CreateLambdaForm {...props} />}
    />
  );
}

export default function Lambdas() {
  const { data, error, loading } = useQuery(GET_LAMBDAS, {
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
    },
    pollInterval: POLL_INTERVAL,
  });

  const [deleteLambda] = useMutation(DELETE_LAMBDA);
  const notificationManager = useNotification();

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <Spinner />;
  }

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
          const deletedLambda = await deleteLambda({
            variables: { name, namespace },
          });
          const isSuccess =
            deletedLambda.data &&
            deletedLambda.data.deleteFunction &&
            deletedLambda.data.deleteFunction.name === name;
          if (isSuccess) {
            notificationManager.notify({
              content: `Lambda ${name} deleted`,
              title: 'Success',
              color: '#107E3E',
              icon: 'accept',
              autoClose: true,
            });
          }
        } catch (e) {
          console.warn(e);
          notificationManager.notify({
            content: `Error while removing lambda ${name}: ${e.message}`,
            title: 'Error',
            color: '#BB0000',
            icon: 'decline',
            autoClose: false,
          });
        }
      })
      .catch(() => {});
  };

  const actions = [
    {
      name: 'Delete',
      handler: entry => {
        handleLambdaDelete(entry.name, entry.namespace);
      },
    },
  ];

  const headerRenderer = () => ['Name', 'Runtime', 'Labels', 'Status'];

  const rowRenderer = item => [
    <span
      className="link"
      data-test-id="lambda-name"
      onClick={() => LuigiClient.linkManager().navigate(`details/${item.name}`)}
    >
      {item.name}
    </span>,
    <span>{item.runtime}</span>,
    Labels(item.labels),
    <LambdaStatusBadge status={item.status} />,
  ];

  return (
    <GenericList
      title="Lambdas"
      description="List of lambdas"
      actions={actions}
      entries={data.functions}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      extraHeaderContent={<CreateLambdaModal />}
    />
  );
}
