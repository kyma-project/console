import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import ServiceInstanceInfo from '../ServiceInstanceInfo/ServiceInstanceInfo.component';
import { serviceInstanceConstants } from './../../../variables';
import {
  Button,
  Modal,
  Breadcrumb,
  Toolbar,
} from '@kyma-project/react-components';
import { UpperBarWrapper, ToolbarWrapper } from './styled';

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

  return (
    <ToolbarWrapper>
      <UpperBarWrapper>
        <Breadcrumb>
          <Breadcrumb.Item
            name={serviceInstanceConstants.instances}
            url="#"
            onClick={goToServiceInstances}
          />
          <Breadcrumb.Item />
        </Breadcrumb>
        <Modal
          title={serviceInstanceConstants.delete}
          confirmText={serviceInstanceConstants.delete}
          cancelText={serviceInstanceConstants.cancel}
          onConfirm={handleDelete}
          modalOpeningComponent={
            <Button type="negative" option="light">
              {serviceInstanceConstants.delete}
            </Button>
          }
          type="negative"
          onShow={() => LuigiClient.uxManager().addBackdrop()}
          onHide={() => LuigiClient.uxManager().removeBackdrop()}
        >
          {`${serviceInstanceConstants.instanceDeleteConfirm} "${
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
