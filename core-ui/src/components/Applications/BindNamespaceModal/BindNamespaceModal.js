import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button } from 'fundamental-react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Modal, useNotification } from 'react-shared';
import { GET_NAMESPACES_NAMES, GET_APPLICATION } from 'gql/queries';
import { BIND_NAMESPACE } from 'gql/mutations';

export default function BindNamespaceModal({ appName, boundNamespaces }) {
  const [namespace, setNamespace] = React.useState(null);
  const [disabled, setDisabled] = React.useState(true);
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

  const { showSystemNamespaces } = LuigiClient.getContext();
  const namespacesQuery = useQuery(GET_NAMESPACES_NAMES, {
    variables: {
      showSystemNamespaces: !!showSystemNamespaces,
    },
  });

  const bindNamespaceToApp = () => {
    bindNamespace({ variables: { namespace, application: appName } })
      .then(
        notificationManager.notifySuccess({
          content: `Namespace ${namespace} bound successfully`,
        }),
      )
      .catch(e => {
        notificationManager.notifyError({
          content: `An error occurred while bounding Namespace ${namespace}: ${e.message}`,
        });
      });
  };

  const AvailableNamespacesList = ({ data, error, loading }) => {
    if (loading) return 'Loading...';
    if (error) return error.message;

    const namespaces = data && data.namespaces ? data.namespaces : [];
    const filteredNamespaces = namespaces.filter(
      namespace => !boundNamespaces.includes(namespace.name),
    );
    if (!filteredNamespaces.length) return 'No Namespaces avaliable to bind';

    if (!namespace) {
      setNamespace(filteredNamespaces[0].name);
      setDisabled(false);
    }

    return (
      <select
        onChange={e => {
          setNamespace(e.target.value);
        }}
        value={namespace || undefined}
      >
        {filteredNamespaces.map(namespace => (
          <option value={namespace.name} key={namespace.name}>
            {namespace.name}
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
      disabledConfirm={disabled}
      onConfirm={() => {
        bindNamespaceToApp();
      }}
      onHide={() => {
        setNamespace(null);
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
