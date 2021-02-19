import React from 'react';

import { BindableServicesList } from './BindableServicesList';
import { createApplicationBinding } from './createApplicationBinding';
import { Button, FormSet } from 'fundamental-react';
import { Modal, useUpdate } from 'react-shared';

export default function EditNamespaceBinding({ application, binding }) {
  const namespace = binding.metadata.namespace;

  const [servicesToBind, setServicesToBind] = React.useState(
    binding.spec.services,
  );

  const patchRequest = useUpdate();

  const modalOpeningComponent = <Button option="light">Edit</Button>;

  async function updateBinding() {
    const applicationBinding = createApplicationBinding(
      application,
      namespace,
      servicesToBind,
    );
    try {
      await patchRequest(
        `/apis/applicationconnector.kyma-project.io/v1alpha1/namespaces/${namespace}/applicationmappings`,
        { name: application.metadata.name, ...applicationBinding },
      );
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <Modal
      confirmText="Create"
      cancelText="Cancel"
      title={`Edit Service Class Binding in '${namespace}'`}
      modalOpeningComponent={modalOpeningComponent}
      onConfirm={updateBinding}
      disabledConfirm={!servicesToBind.length}
    >
      <FormSet>
        <BindableServicesList
          availableServices={application.spec.services}
          services={servicesToBind}
          setServices={setServicesToBind}
        />
      </FormSet>
    </Modal>
  );
}
