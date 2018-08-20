import React from 'react';

import {
  Button,
  ConfirmationModal,
  Toolbar,
} from '@kyma-project/react-components';

import {
  ServiceInstanceToolbarHeadline,
  ServiceInstanceToolbarHeadlineBlue,
} from './styled';

const ServiceInstanceToolbar = ({
  serviceInstance,
  deleteServiceInstance,
  history,
}) => {
  const handleDelete = async () => {
    await deleteServiceInstance(serviceInstance.name);
    setTimeout(() => {
      history.goBack();
    }, 300);
  };

  return (
    <Toolbar
      headline={
        <ServiceInstanceToolbarHeadline>
          <ServiceInstanceToolbarHeadlineBlue style={{ color: '#0b74de' }}>
            Service Instances
          </ServiceInstanceToolbarHeadlineBlue>{' '}
          / {serviceInstance.name}
        </ServiceInstanceToolbarHeadline>
      }
      description={
        serviceInstance &&
        serviceInstance.serviceClass &&
        serviceInstance.serviceClass.description
      }
    >
      <ConfirmationModal
        title="Delete"
        content={`Are you sure you want to delete instance "${
          serviceInstance.name
        }"?`}
        confirmText="Delete"
        cancelText="Cancel"
        handleConfirmation={handleDelete}
        modalOpeningComponent={
          <Button normal last remove>
            Delete
          </Button>
        }
        warning={true}
        width={'481px'}
      />
    </Toolbar>
  );
};

export default ServiceInstanceToolbar;
