import React from 'react';
import { Button } from 'fundamental-react';

import { ModalWithForm } from 'react-shared';

export const NamespaceCreateModal = ({ ResourcesCreateForm, ...params }) => {
  const { resourceType } = params;
  const modalOpeningComponent = (
    <Button glyph="add" option="light">
      Create {resourceType}
    </Button>
  );

  return (
    <ModalWithForm
      title={`Create ${resourceType}`}
      modalOpeningComponent={modalOpeningComponent}
      confirmText="Create"
      id={`add-${resourceType}-modal`}
      className="fd-modal--l-size"
      renderForm={props => <ResourcesCreateForm {...params} {...props} />}
    />
  );
};
