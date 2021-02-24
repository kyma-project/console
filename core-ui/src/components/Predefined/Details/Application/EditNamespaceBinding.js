import React from 'react';

import { BindableServicesList } from './BindableServicesList';
import { Button, FormSet } from 'fundamental-react';
import { Modal, useUpdate } from 'react-shared';
import { createPatch } from 'rfc6902';

export default function EditNamespaceBinding({ application, binding }) {
  const namespace = binding.metadata.namespace;
  const [servicesToBind, setServicesToBind] = React.useState([]);
  const patchRequest = useUpdate();
  const modalOpeningComponent = <Button option="light">Edit</Button>;

  async function updateBinding() {
    const newBinding = JSON.parse(JSON.stringify(binding));
    newBinding.spec.services = application.spec.services.filter(s =>
      servicesToBind.find(svc => svc.id === s.id),
    );

    try {
      await patchRequest(
        binding.metadata.selfLink,
        createPatch(binding, newBinding),
      );
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <Modal
      confirmText="Edit"
      cancelText="Cancel"
      title={`Edit Service Class Binding in '${namespace}'`}
      modalOpeningComponent={modalOpeningComponent}
      onConfirm={updateBinding}
      onShow={() => setServicesToBind(binding.spec.services)}
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
