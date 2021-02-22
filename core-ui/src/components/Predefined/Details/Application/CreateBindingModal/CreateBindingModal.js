import React from 'react';
import {
  Button,
  FormLabel,
  FormSet,
  Menu,
  ComboboxInput,
} from 'fundamental-react';
import {
  Modal,
  useGetList,
  usePost,
  useMicrofrontendContext,
  useNotification,
} from 'react-shared';
import './CreateBindingModal.scss';
import { BindableServicesList } from '../BindableServicesList';
import { createApplicationBinding } from './createApplicationBinding';

export default function CreateBindingModal({
  application,
  alreadyBoundNamespaces,
}) {
  const { systemNamespaces } = useMicrofrontendContext();
  const [servicesToBind, setServicesToBind] = React.useState([]);
  const [namespaceName, setNamespaceName] = React.useState('');
  const notification = useNotification();

  const postRequest = usePost();

  const { data, loading, error } = useGetList(() => true)(
    '/api/v1/namespaces',
    {},
  );

  const modalOpeningComponent = (
    <Button glyph="add" option="light">
      Create Binding
    </Button>
  );

  async function createBinding() {
    const applicationBinding = createApplicationBinding(
      application,
      namespaceName,
      servicesToBind,
    );
    try {
      await postRequest(
        `/apis/applicationconnector.kyma-project.io/v1alpha1/namespaces/${namespaceName}/applicationmappings`,
        applicationBinding,
      );
      notification.notifySuccess({ title: 'Binding created' });
    } catch (e) {
      console.warn(e);
      notification.notifyError({
        title: 'Failed to create the binding',
        content: e.message,
      });
    }
  }

  const namespaceNames =
    data
      ?.map(n => n.metadata.name)
      .filter(name => !alreadyBoundNamespaces.includes(name))
      .filter(name => !systemNamespaces.includes(name)) || [];

  const disabledConfirm = !namespaceName || !servicesToBind.length;

  return (
    <Modal
      confirmText="Create"
      cancelText="Cancel"
      title="Create Namespace Binding"
      modalOpeningComponent={modalOpeningComponent}
      onConfirm={createBinding}
      disabledConfirm={disabledConfirm}
      onHide={() => setNamespaceName('')}
    >
      {error && error.message}
      {loading && 'Loading...'}
      {data && (
        <FormSet>
          <FormLabel required>Namespace</FormLabel>
          <ComboboxInput
            inputProps={{
              value: namespaceName,
              readOnly: true,
              className: 'namespace-combobox__input',
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
                {!namespaceNames.length && (
                  <Menu.Item>No namespaces to bind</Menu.Item>
                )}
              </Menu.List>
            }
          />
          <BindableServicesList
            services={[]}
            availableServices={application.spec.services}
            setServices={setServicesToBind}
          />
        </FormSet>
      )}
    </Modal>
  );
}
