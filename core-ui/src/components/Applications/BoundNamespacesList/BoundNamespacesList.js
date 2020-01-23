import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';

import { useNotification } from 'contexts/notifications';
import { GenericList } from 'react-shared';
import BindNamespaceModal from '../BindNamespaceModal/BindNamespaceModal';
import { UNBIND_NAMESPACE } from 'gql/mutations';

export default function BoundNamespacesList({ data, appName, refetch }) {
  const [unbindNamespace] = useMutation(UNBIND_NAMESPACE);
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
                if (refetch) {
                  try {
                    refetch();
                  } catch (e) {
                    notificationManager.notify({
                      content: `Could not get updated Application details due to an error: ${e.message}`,
                      title: 'Error',
                      color: '#BB0000',
                      icon: 'decline',
                      autoClose: false,
                    });
                  }
                }
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
        extraHeaderContent={<BindNamespaceModal />}
      />
    </>
  );
}
