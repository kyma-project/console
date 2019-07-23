import React from 'react';
import { Mutation } from 'react-apollo';
import { Modal } from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';
import { DELETE_APPLICATION_API, GET_APPLICATION } from './../../gql';

export default function ApiDeleteModal(props) {
  const updateCache = store => {
    const originalQuery = {
      query: GET_APPLICATION,
      variables: { id: props.applicationId },
    };
    const { application } = store.readQuery(originalQuery);

    application.apis.data = application.apis.data.filter(
      api => api.id !== props.api.id,
    );

    store.writeQuery({
      ...originalQuery,
      data: { application },
    });
  };

  return (
    <Mutation
      mutation={DELETE_APPLICATION_API}
      variables={{ id: props.api.id }}
      update={updateCache}
    >
      {(handleDelete, result) => {
        const { loading, error, called } = result;
        if (loading) {
          return <p>Loading...</p>;
        }

        if (error) {
          console.warn(error);
          LuigiClient.uxManager().showAlert({
            text: error.message,
            type: 'error',
            closeAfter: 2000,
          });
        }

        if (called && !error) {
          // LuigiClient.uxManager().showAlert({
          //   text: `YEAH ${name} with id ${id}`,
          //   type: "success",
          //   closeAfter: 2000
          // });
        }

        return (
          <Modal
            title={'Confirm delete'}
            confirmText={'Delete'}
            onConfirm={handleDelete}
            modalOpeningComponent={props.modalOpeningComponent}
            type="negative"
            onShow={() => LuigiClient.uxManager().addBackdrop()}
            onHide={() => LuigiClient.uxManager().removeBackdrop()}
          >
            {`Delete "${props.api.name}"?`}
          </Modal>
        );
      }}
    </Mutation>
  );
}
