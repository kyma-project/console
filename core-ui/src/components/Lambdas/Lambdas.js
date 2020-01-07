import React from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import CreateLambdaForm from './CreateLambdaForm/CreateLambdaForm';
import { useQuery, useMutation } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { GET_LAMBDAS } from '../../gql/queries';
import { DELETE_LAMBDA } from '../../gql/mutations';

import { GenericList } from 'react-shared';

import builder from '../../commons/builder';

import { useNotification } from '../../contexts/notifications';
import { Spinner } from 'react-shared';
import LambdaStatusBadge from '../../shared/components/LambdaStatusBadge/LambdaStatusBadge';
import Labels from '../../shared/components/Labels/Labels';
import { REFETCH_TIMEOUT } from '../../shared/constants';
import { PageHeader } from 'react-shared';

function CreateLambdaModal() {
  return (
    <ModalWithForm
      title="Create new lambda"
      button={{ text: 'Create lambda', option: 'light' }}
      id="add-lambda-modal"
      renderForm={props => <CreateLambdaForm {...props} />}
    />
  );
}

export default function Lambdas() {
  const { data, error, loading, refetch } = useQuery(GET_LAMBDAS, {
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
    },
    fetchPolicy: 'no-cache',
  });

  // onCompleted is fired before lambda is deleted therefore setTimeout is neccessary
  const [deleteLambda] = useMutation(DELETE_LAMBDA, {
    onCompleted: () => {
      setTimeout(() => {
        refetch();
      }, REFETCH_TIMEOUT);
    },
  });
  const notificationManager = useNotification();

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <Spinner />;
  }

  const handleLambdaDelete = (name, namespace, onComplete) => {
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
        handleLambdaDelete(entry.name, entry.namespace, refetch);
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
    <>
      <PageHeader title="Lambdas" />
      <GenericList
        actions={actions}
        entries={data.functions}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        extraHeaderContent={<CreateLambdaModal />}
      />
    </>
  );
}
