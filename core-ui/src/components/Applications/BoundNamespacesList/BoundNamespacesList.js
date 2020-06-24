import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';

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
            unbindNamespace({
              variables: { namespace, application: appName },
              refetchQueries: [
                {
                  query: GET_APPLICATION,
                  variables: {
                    name: appName,
                  },
                },
              ],
            })
              .then(() => {
                notificationManager.notifySuccess({
                  content: `Namespace ${namespace} unbound successfully`,
                });
              })
              .catch(e => {
                notificationManager.notifyError({
                  content: `Could not unbind Namespace due to an error: ${e.message}`,
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
        testid="namespace-bindings-list"
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

BoundNamespacesList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  appName: PropTypes.string.isRequired,
};
