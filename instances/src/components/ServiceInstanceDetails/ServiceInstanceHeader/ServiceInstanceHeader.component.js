import React from 'react';
import ServiceInstanceInfo from '../ServiceInstanceInfo/ServiceInstanceInfo.component';
import { Toolbar, } from '@kyma-project/react-components';
import { ToolbarWrapper } from './styled';
import { Breadcrumb } from '@kyma-project/react-components';
import { Button, Modal, } from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';

import { UpperBarWrapper } from './styled';

const ServiceInstanceHeader = ({
  serviceInstance,
  deleteServiceInstance,
  history,
}) => {

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

  return ( <ToolbarWrapper>
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
      <Toolbar title={serviceInstance.name} />
      <ServiceInstanceInfo serviceInstance={serviceInstance} />
    </ToolbarWrapper>
  );
};

export default ServiceInstanceHeader;