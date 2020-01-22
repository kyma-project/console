import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Menu, Dropdown, Button, Popover } from 'fundamental-react';

import { GET_NAMESPACES } from '../../../gql/queries';
import ModalWithForm from 'components/ModalWithForm/ModalWithForm';

export default function BindNamespaceModal() {
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

  const [namespace, setNamespace] = React.useState(null);

  const AvailableNamespacesList = ({ data, error, loading }) => {
    if (error || loading) {
      return null;
    }
    const namespaces = data.namespaces ? data.namespaces : [];
    return (
      <Menu className="namespace-list">
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
    if (error || (!loading && data && !data.namespaces)) {
      // sometimes after an error, there is an empty data object returned. To investigate.
      console.warn(error);
      return 'Error! Cannot load namespaces list.';
    } else if (loading) {
      return 'Choose namespace (loading...)';
    } else {
      return 'Choose namespace';
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
    <ModalWithForm
      title="Create binding for Application"
      button={{ text: 'Add Binding', option: 'light' }}
      id="add-binding-modal"
      renderForm={() => content}
    />
  );
}
