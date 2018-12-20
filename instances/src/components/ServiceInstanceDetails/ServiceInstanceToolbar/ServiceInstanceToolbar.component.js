import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import {
  Button,
  ConfirmationModal,
  Toolbar,
} from '@kyma-project/react-components';

import {
  ServiceInstanceToolbarHeadline,
  ServiceInstanceToolbarHeadlineLink,
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
    }, 100);
  };

  const goToServiceInstances = () => {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate('instances');
  };

  const instanceClass =
    serviceInstance &&
    (serviceInstance.clusterServiceClass
      ? serviceInstance.clusterServiceClass
      : serviceInstance.serviceClass);

  return (
    <Toolbar
      headline={
        <ServiceInstanceToolbarHeadline>
          <ServiceInstanceToolbarHeadlineLink onClick={goToServiceInstances}>
            Service Instances
          </ServiceInstanceToolbarHeadlineLink>{' '}
          / {serviceInstance.name}
        </ServiceInstanceToolbarHeadline>
      }
      description={instanceClass && instanceClass.description}
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
