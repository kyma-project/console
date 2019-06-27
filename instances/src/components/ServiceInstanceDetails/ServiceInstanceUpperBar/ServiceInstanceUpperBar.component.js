import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { Breadcrumb } from '@kyma-project/react-components';

import {
  Button,
  Modal,
} from '@kyma-project/react-components';

import {
  UpperBarWrapper
} from './styled';

  const ServiceInstanceUpperBar = ({
    serviceInstance,
    deleteServiceInstance,
    history,
  })  => {

    const goToServiceInstances = () => {
      LuigiClient.linkManager()
        .fromContext('namespaces')
        .navigate('cmf-instances');
    };
  
    const handleDelete = async () => {
      await deleteServiceInstance(serviceInstance.name);
      setTimeout(() => {
        history.goBack();
      }, 100);
    };

    return (
      <UpperBarWrapper>
        <Breadcrumb>
          <Breadcrumb.Item name="Instances" url="#" onClick={goToServiceInstances} />
          <Breadcrumb.Item/>
        </Breadcrumb>
        <Modal
          title="Delete"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          modalOpeningComponent={
            <Button type="negative" option="light">
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
      </UpperBarWrapper>
    );
  };
export default ServiceInstanceUpperBar;
