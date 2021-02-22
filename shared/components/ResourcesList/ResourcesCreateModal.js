import React, { useState } from 'react';
import { Button } from 'fundamental-react';

import { ModalWithForm } from '../ModalWithForm/ModalWithForm';
import ResourcesCreateForm from './ResourcesCreateForm';

const ResourcesCreateModal = ({ resourceType, resourceUrl, namespace }) => {
  const [invalidModalPopupMessage, setInvalidModalPopupMessage] = useState('');

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
      invalidPopupMessage={invalidModalPopupMessage}
      id={`add-${resourceType}-modal`}
      className="fd-modal--l-size"
      renderForm={props => (
        <ResourcesCreateForm
          resourceType={resourceType}
          resourceUrl={resourceUrl}
          namespace={namespace}
          {...props}
        />
      )}
    />
  );
};

export default ResourcesCreateModal;
