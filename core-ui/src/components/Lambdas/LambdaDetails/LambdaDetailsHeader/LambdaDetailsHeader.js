import React from 'react';
import PropTypes from 'prop-types';
import { ActionBar, Button, Breadcrumb } from 'fundamental-react';
import LuigiClient from '@kyma-project/luigi-client';
import { useMutation } from '@apollo/react-hooks';

import { handleDelete } from 'react-shared';
import { DELETE_LAMBDA } from '../../../../gql/mutations';
import { useNotification } from '../../../../contexts/notifications';
import { REFETCH_TIMEOUT } from '../../../../shared/constants';

LambdaDetailsHeader.propTypes = {
  lambda: PropTypes.object.isRequired,
  handleUpdate: PropTypes.func.isRequired,
};

export default function LambdaDetailsHeader({ lambda, handleUpdate }) {
  const { name, namespace } = lambda;
  const [deleteLambda] = useMutation(DELETE_LAMBDA);
  const notificationManager = useNotification();

  const handleLambdaDelete = async () => {
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
      notificationManager.notify({
        content: `Error while removing lambda ${name}: ${e.message}`,
        title: 'Error',
        color: '#BB0000',
        icon: 'decline',
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
