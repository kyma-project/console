import React from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import CreateLambdaForm from './CreateLambdaForm/CreateLambdaForm';
import { useQuery, useMutation } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { GET_LAMBDAS } from '../../gql/queries';
import {
  DELETE_LAMBDA,
  DELETE_SERVICE_BINDING_USAGES,
} from '../../gql/mutations';

import { GenericList, useNotification } from 'react-shared';

import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import builder from '../../commons/builder';
import { Spinner, Labels } from 'react-shared';
import LambdaStatusBadge from '../../shared/components/LambdaStatusBadge/LambdaStatusBadge';
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

  const [deleteLambdaServiceBindingUsages] = useMutation(
    DELETE_SERVICE_BINDING_USAGES,
  );
  const [deleteLambda] = useMutation(DELETE_LAMBDA);
  const notificationManager = useNotification();

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <Spinner />;
  }

  function handleError(error, name) {
    const errorToDisplay = extractGraphQlErrors(error);
    notificationManager.notifyError({
      content: `Error while removing lambda ${name}: ${errorToDisplay}`,
      autoClose: false,
    });
  }

  const handleLambdaDelete = (lambda, refetch) => {
    const name = lambda.name;
    const namespace = lambda.namespace;

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
            variables: {
              name,
              namespace,
            },
          });

          if (deletedLambda.error) {
            handleError(deletedLambda.error, name);
            return;
          }

          const serviceBindingUsageNames = (
            lambda.serviceBindingUsages || []
          ).map(s => s.name);
          if (serviceBindingUsageNames.length) {
            const deletedBindingUsages = await deleteLambdaServiceBindingUsages(
              {
                variables: { serviceBindingUsageNames, namespace },
              },
            );

            if (deletedBindingUsages.error) {
              handleError(deletedLambda.error);
              return;
            }
          }

          notificationManager.notifySuccess({
            content: `Lambda ${name} deleted`,
            autoClose: true,
          });
          setTimeout(() => {
            refetch();
          }, REFETCH_TIMEOUT);
        } catch (e) {
          handleError(e, name);
        }
      })
      .catch(() => {});
  };

  const actions = [
    {
      name: 'Delete',
      handler: entry => {
        handleLambdaDelete(entry, refetch);
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
    <Labels labels={item.labels} />,
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
