import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button } from 'fundamental-react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Modal, useNotification } from 'react-shared';
import { GET_NAMESPACES_NAMES, GET_APPLICATION } from 'gql/queries';
import { BIND_NAMESPACE } from 'gql/mutations';

function getNotBoundNamespaces(allNamespaces, boundNamespaces) {
  return allNamespaces.filter(ns => !boundNamespaces.includes(ns.name));
}

export default function BindNamespaceModal({ appName, boundNamespaces }) {
  const { showSystemNamespaces } = LuigiClient.getContext();

  const namespacesQuery = useQuery(GET_NAMESPACES_NAMES, {
    variables: {
      showSystemNamespaces: !!showSystemNamespaces,
    },
  });

  const allNamespaces = namespacesQuery.data?.namespaces;
  const availableNamespaces = allNamespaces
    ? getNotBoundNamespaces(allNamespaces, boundNamespaces)
    : [];

  const [selectedNamespace, setSelectedNamespace] = React.useState(null);

  const [bindNamespace] = useMutation(BIND_NAMESPACE, {
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

  useEffect(() => {
    if (!availableNamespaces.length || selectedNamespace) return;
    setSelectedNamespace(availableNamespaces[0]);
  }, [selectedNamespace, setSelectedNamespace, availableNamespaces]);

  const bindNamespaceToApp = () => {
    bindNamespace({
      variables: { namespace: selectedNamespace, application: appName },
    })
      .then(
        notificationManager.notifySuccess({
          content: `Namespace ${selectedNamespace} bound successfully`,
        }),
      )
      .catch(e => {
        notificationManager.notifyError({
          content: `An error occurred while bounding Namespace ${selectedNamespace}: ${e.message}`,
        });
      });
  };

  const AvailableNamespacesList = () => {
    if (!availableNamespaces.length) return 'No Namespaces avaliable to bind';

    return (
      <select
        onChange={e => {
          setSelectedNamespace(e.target.value);
        }}
        value={selectedNamespace || undefined}
      >
        {availableNamespaces.map(ns => (
          <option value={ns.name} key={ns.name}>
            {ns.name}
          </option>
        ))}
      </select>
    );
  };

  const content = (
    <section className="create-binding-form">
      <AvailableNamespacesList {...namespacesQuery} />
    </section>
  );

  return (
    <Modal
      id="add-binding-modal"
      title="Create Namespace binding for Application"
      modalOpeningComponent={<Button>Create Binding</Button>}
      confirmText="Bind"
      cancelText="Cancel"
      disabledConfirm={!selectedNamespace}
      onConfirm={() => {
        bindNamespaceToApp();
      }}
    >
      {content}
    </Modal>
  );
}

BindNamespaceModal.propTypes = {
  boundNamespaces: PropTypes.arrayOf(PropTypes.string).isRequired,
  appName: PropTypes.string.isRequired,
};
