import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import ServiceInstanceInfo from '../ServiceInstanceInfo/ServiceInstanceInfo';
import { serviceInstanceConstants } from '../../../variables';
import {
  Button,
  Modal,
  Breadcrumb,
  Toolbar,
} from '@kyma-project/react-components';
import { BreadcrumbWrapper, ToolbarWrapper } from './styled';
import builder from '../../../commons/builder';
import { isService } from '../../../commons/helpers';

const ServiceInstanceHeader = ({
  serviceInstance,
  instanceClass,
  deleteServiceInstance,
  history,
}) => {
  const goToServiceInstances = () => {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .withParams({
        selectedTab: isService(serviceInstance) ? 'services' : 'addons',
      })
      .navigate('cmf-instances');
  };

  const handleDelete = async () => {
    await deleteServiceInstance({
      variables: {
        namespace: builder.getCurrentEnvironmentId(),
        name: serviceInstance.name,
      },
    });
    setTimeout(() => {
      LuigiClient.linkManager()
        .fromContext('namespaces')
        .navigate('cmf-instances');
    }, 100);
  };

  return (
    <ToolbarWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb>
          <Breadcrumb.Item
            name={`${serviceInstanceConstants.instances} - ${
              isService(serviceInstance) ? 'Services' : 'Addons'
            }`}
            url="#"
            onClick={goToServiceInstances}
          />
          <Breadcrumb.Item />
        </Breadcrumb>
      </BreadcrumbWrapper>

      <Toolbar
        title={serviceInstance.name}
        description={
          instanceClass
            ? instanceClass.description
            : serviceInstanceConstants.noDescription
        }
        nowrap="true"
      >
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
          {`${serviceInstanceConstants.instanceDeleteConfirm} "${serviceInstance.name}"?`}
        </Modal>
      </Toolbar>

      <ServiceInstanceInfo serviceInstance={serviceInstance} />
    </ToolbarWrapper>
  );
};

export default ServiceInstanceHeader;
