import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Menu, Dropdown, Button, Popover } from 'fundamental-react';

import { Modal } from 'react-shared';
import { GET_NAMESPACES } from '../../../gql/queries';
import './BindNamespaceModal.scss';

export default function BindNamespaceModal() {
  const [namespace, setNamespace] = React.useState(null);

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

  const bindNamespace = () => {
    console.log(namespace);
  };

  const AvailableNamespacesList = ({ data, error, loading }) => {
    if (error || loading) {
      return null;
    }
    const namespaces = data.namespaces ? data.namespaces : [];
    return (
      <Menu>
        {namespaces.length ? (
          namespaces.map(namespace => (
            <Menu.Item
              key={namespace.name}
              onClick={() => setNamespace(namespace)}
            >
              {namespace.name}
            </Menu.Item>
          ))
        ) : (
          <Menu.Item>No namespaces available</Menu.Item>
        )}
      </Menu>
    );
  };

  const dropdownControlText = () => {
    const { loading, error, data } = namespacesQuery;
    if (namespace) {
      return namespace;
    } else if (namespacesQuery) {
      if (error || (!loading && data && !data.namespaces)) {
        // sometimes after an error, there is an empty data object returned. To investigate.
        console.warn(error);
        return 'Error! Cannot load namespaces list.';
      } else if (loading) {
        return 'Choose namespace (loading...)';
      } else {
        return 'Choose namespace';
      }
    }
  };

  const content = (
    <section className="create-binding-form">
      <Dropdown>
        <Popover
          body={<AvailableNamespacesList {...namespacesQuery} />}
          disableEdgeDetection={true}
          control={
            <Button className="fd-dropdown__control">
              {dropdownControlText()}
            </Button>
          }
        />
      </Dropdown>
    </section>
  );

  return (
    <Modal
      id="add-binding-modal"
      title="Create Namespace binding for Application"
      modalOpeningComponent={<Button> Create Binding </Button>}
      confirmText="Bind"
      cancelText="Cancel"
      disabledConfirm={!namespace}
      onConfirm={() => {
        bindNamespace();
      }}
      onHide={() => {
        setNamespace(null);
      }}
    >
      {content}
    </Modal>
  );
}
