import React from 'react';
import PropTypes from 'prop-types';
import { ActionBar, Button, Breadcrumb } from 'fundamental-react';
import LuigiClient from '@kyma-project/luigi-client';
import { useMutation } from '@apollo/react-hooks';

import { handleDelete } from 'react-shared';
import {
  DELETE_LAMBDA,
  DELETE_SERVICE_BINDING_USAGES,
} from '../../../../gql/mutations';
import { useNotification } from 'react-shared';
import { REFETCH_TIMEOUT } from '../../../../shared/constants';

import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

LambdaDetailsHeader.propTypes = {
  lambda: PropTypes.object.isRequired,
  handleUpdate: PropTypes.func.isRequired,
};

export default function LambdaDetailsHeader({ lambda, handleUpdate }) {
  const { name, namespace, serviceBindingUsages } = lambda;
  const [deleteLambda] = useMutation(DELETE_LAMBDA);
  const [deleteLambdaServiceBindingUsages] = useMutation(
    DELETE_SERVICE_BINDING_USAGES,
  );
  const notificationManager = useNotification();

  function handleError(error) {
    const errorToDisplay = extractGraphQlErrors(error);
    notificationManager.notifyError({
      content: `Error while removing lambda ${name}: ${errorToDisplay}`,
    });
  }

  const handleLambdaDelete = async () => {
    try {
      const deletedLambda = await deleteLambda({
        variables: { name, namespace },
      });

      if (deletedLambda.error) {
        handleError(deletedLambda.error);
        return;
      }

      const serviceBindingUsageNames = serviceBindingUsages.map(s => s.name);
      if (serviceBindingUsageNames.length) {
        const deletedBindingUsages = await deleteLambdaServiceBindingUsages({
          variables: { serviceBindingUsageNames, namespace },
        });

        if (deletedBindingUsages.error) {
          handleError(deletedLambda.error);
          return;
        }
      }

      notificationManager.notifySuccess({
        content: `Lambda ${name} deleted`,
        autoClose: true,
      });
    } catch (e) {
      notificationManager.notifyError({
        content: `Error while removing lambda ${name}: ${e.message}`,
        autoClose: false,
      });
    }
  };

  const navigateToList = () => {
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate('');
  };

  return (
    <header className="fd-has-background-color-background-2">
      <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
        <section>
          <Breadcrumb>
            <Breadcrumb.Item
              name="Lambdas"
              url="#"
              onClick={() => navigateToList()}
            />
            <Breadcrumb.Item />
          </Breadcrumb>
          <ActionBar.Header title={name || 'Loading name...'} />
        </section>
        <ActionBar.Actions>
          <Button onClick={handleUpdate} data-test-id="lambda-save-button">
            Save
          </Button>
          <Button
            onClick={() => {
              handleDelete('Lambda', name, name, handleLambdaDelete, () => {
                setTimeout(() => {
                  navigateToList();
                }, REFETCH_TIMEOUT);
              });
            }}
            option="light"
            type="negative"
          >
            Delete
          </Button>
        </ActionBar.Actions>
      </section>
    </header>
  );
}
