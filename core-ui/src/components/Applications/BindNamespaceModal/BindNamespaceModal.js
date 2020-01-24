import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button } from 'fundamental-react';

import { Modal } from 'react-shared';
import { GET_NAMESPACES, GET_APPLICATION } from 'gql/queries';
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

  let showSystemNamespaces = false;
  if (localStorage.getItem('console.showSystemNamespaces')) {
    showSystemNamespaces =
      localStorage.getItem('console.showSystemNamespaces') === 'true';
  }

  const namespacesQuery = useQuery(GET_NAMESPACES, {
    variables: {
      showSystemNamespaces: !!showSystemNamespaces,
    },
  });

  const bindNamespaceToApp = () => {
    bindNamespace({ variables: { namespace, application: appName } })
      .then()
      .catch(e => {});
  };

  const AvailableNamespacesList = ({ data, error, loading }) => {
    if (loading) return 'Loading...';
    if (error) return error.message;

    const namespaces = data.namespaces ? data.namespaces : [];
    const filteredNamespaces = namespaces.filter(
      namespace => !boundNamespaces.includes(namespace.name),
    );
    if (!filteredNamespaces.length) return 'No Namespaces avaliable to bind';

    setDisabled(false);
    return (
      <select
        onChange={e => {
          setNamespace(e.target.value);
        }}
        value={namespace}
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
      modalOpeningComponent={<Button> Create Binding </Button>}
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
