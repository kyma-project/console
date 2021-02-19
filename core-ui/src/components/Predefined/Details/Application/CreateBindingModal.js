import React from 'react';
import {
  Button,
  FormLabel,
  FormSet,
  Menu,
  ComboboxInput,
} from 'fundamental-react';
import { Modal, useGetList } from 'react-shared';

function BigAssServicesList({ services }) {
  const applicationHasAnyServices = services?.length > 0;

  if (!applicationHasAnyServices) {
    return (
      <p className="fd-has-color-text-4 fd-has-margin-top-s fd-has-margin-bottom-s">
        This Application doesn't expose any Service or Events.
      </p>
    );
  } else {
    console.log(services.length);
    return (
      <ul>
        {services.map(service => {
          console.log(service);
          return <li>{service.displayName}</li>;
        })}
      </ul>
    );
  }
}

function CreateBindingForm({ application, namespaceNames }) {
  const [namespaceName, setNamespaceName] = React.useState('');

  return (
    <FormSet>
      <FormLabel required>Namespace</FormLabel>
      <ComboboxInput
        inputProps={{
          value: namespaceName,
          readOnly: true,
        }}
        placeholder="Choose namespace..."
        className="namespace-combobox"
        menu={
          <Menu.List className="namespace-combobox__list">
            {namespaceNames.map(name => (
              <Menu.Item key={name} onClick={() => setNamespaceName(name)}>
                {name}
              </Menu.Item>
            ))}
          </Menu.List>
        }
      />
      <FormLabel required>Applications & Events</FormLabel>
      <BigAssServicesList services={application.spec.services} />
    </FormSet>
  );
}

export default function CreateBindingModal({ application }) {
  console.warn('TODO SYSTEM NAMESPACES');
  const { data, loading, error } = useGetList(() => true)(
    '/api/v1/namespaces',
    {},
  );

  const modalOpeningComponent = (
    <Button glyph="add" option="light">
      Create Binding
    </Button>
  );

  return (
    <Modal
      confirmText="Create"
      cancelText="Cancel"
      title="Create Namespace Binding"
      modalOpeningComponent={modalOpeningComponent}
    >
      {error && error.message}
      {loading && 'Loading...'}
      {data && (
        <CreateBindingForm
          application={application}
          namespaceNames={data.map(n => n.metadata.name)}
        />
      )}
    </Modal>
  );
}
