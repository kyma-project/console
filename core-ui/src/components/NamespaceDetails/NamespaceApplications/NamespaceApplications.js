import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import { UNBIND_NAMESPACE } from 'gql/mutations';
import { GET_NAMESPACE } from 'gql/queries';

import { GenericList, useNotification } from 'react-shared';

NamespaceApplications.propTypes = { namespace: PropTypes.object.isRequired };

export default function NamespaceApplications({ namespace }) {
  const notification = useNotification();
  const [unbindNamespace] = useMutation(UNBIND_NAMESPACE);

  const actions = [
    {
      name: 'Unbind',
      handler: ({ name }) => {
        LuigiClient.uxManager()
          .showConfirmationModal({
            header: `Unbind ${name}`,
            body: `Are you sure you want to unbind Application ${name}?`,
            buttonConfirm: 'Confirm',
            buttonDismiss: 'Cancel',
          })
          .then(() =>
            unbindNamespace({
              variables: {
                namespace: namespace.name,
                application: name,
              },
              refetchQueries: () => [
                {
                  query: GET_NAMESPACE,
                  variables: {
                    name: namespace.name,
                  },
                },
              ],
            })
              .then(() => {
                notification.notifySuccess({
                  content: `Application ${name} unbound successfully`,
                });
              })
              .catch(e => {
                notification.notifyError({
                  content: `Could not unbind Application: ${e.message}`,
                });
              }),
          )
          .catch(() => {});
      },
    },
  ];

  return (
    <GenericList
      title="Connected Applications"
      notFoundMessage="No connected applications"
      entries={namespace.applications.map(name => ({ name }))}
      headerRenderer={() => ['Name']}
      rowRenderer={app => [app.name]}
      actions={actions}
    />
  );
}
