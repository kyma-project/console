import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';

import { GenericList, useNotification } from 'react-shared';
import BindNamespaceModal from '../BindNamespaceModal/BindNamespaceModal';
import { UNBIND_NAMESPACE } from 'gql/mutations';
import { GET_APPLICATION } from 'gql/queries';

export default function BoundNamespacesList({ data, appName }) {
  const [unbindNamespace] = useMutation(UNBIND_NAMESPACE, {
    refetchQueries: [
      {
        query: GET_APPLICATION,
        variables: {
          name: appName,
        },
      },
    ],
  });
  const notificationManager = useNotification();

  const actions = [
    {
      name: 'Unbind',
      handler: namespace => {
        LuigiClient.uxManager()
          .showConfirmationModal({
            header: `Unbind ${namespace}`,
            body: `Are you sure you want to unbind Namespace ${namespace}?`,
            buttonConfirm: 'Delete',
            buttonDismiss: 'Cancel',
          })
          .then(() => {
            unbindNamespace({ variables: { namespace, application: appName } })
              .then(() => {
                notificationManager.notify({
                  content: `Namespace ${namespace} unbound successfully`,
                  title: 'Success',
                  color: '#107E3E',
                  icon: 'accept',
                  autoClose: true,
                });
              })
              .catch(e => {
                notificationManager.notify({
                  content: `Could not unbind Namespace due to an error: ${e.message}`,
                  title: 'Error',
                  color: '#BB0000',
                  icon: 'decline',
                  autoClose: false,
                });
              });
          })
          .catch(() => {});
      },
    },
  ];

  const headerRenderer = () => ['Name'];

  const rowRenderer = item => [item];

  return (
    <>
      <GenericList
        title="Namespace Binding"
        actions={actions}
        entries={data}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        extraHeaderContent={
          <BindNamespaceModal boundNamespaces={data} appName={appName} />
        }
      />
    </>
  );
}
