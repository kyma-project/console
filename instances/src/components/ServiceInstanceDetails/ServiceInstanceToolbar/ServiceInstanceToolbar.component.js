import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import {
  Button,
  Modal,
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
      .navigate('cmf-instances');
  };

  const instanceClass =
    serviceInstance &&
    (serviceInstance.clusterServiceClass
      ? serviceInstance.clusterServiceClass
      : serviceInstance.serviceClass);

  return (
    <Toolbar
      title={
        <ServiceInstanceToolbarHeadline>
          <ServiceInstanceToolbarHeadlineLink onClick={goToServiceInstances}>
            Service Instances
          </ServiceInstanceToolbarHeadlineLink>{' '}
          / {serviceInstance.name}
        </ServiceInstanceToolbarHeadline>
      }
      description={instanceClass && instanceClass.description}
    >
      <Modal
        title="Delete"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        modalOpeningComponent={
          <Button type="negative">
            Delete
          </Button>
        }
        type="negative"
        onShow={() => LuigiClient.uxManager().addBackdrop()}
        onHide={() => LuigiClient.uxManager().removeBackdrop()}
      >
        {`Are you sure you want to delete instance "${
          serviceInstance.name
        }"?`}
      </Modal>
    </Toolbar>
  );
};

export default ServiceInstanceToolbar;
