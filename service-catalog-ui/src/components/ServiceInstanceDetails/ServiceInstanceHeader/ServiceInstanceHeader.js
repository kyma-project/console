import React from 'react';
import LuigiClient from '@luigi-project/client';
import ServiceInstanceInfo from '../ServiceInstanceInfo/ServiceInstanceInfo';
import { serviceInstanceConstants } from 'helpers/constants';
import { Toolbar } from '@kyma-project/react-components';
import { Button, Breadcrumb } from 'fundamental-react';
import { Modal } from 'react-shared';
import { BreadcrumbWrapper, ToolbarWrapper } from './styled';
import { isService } from 'helpers';

const ServiceInstanceHeader = ({
  serviceInstance,
  instanceClass,
  deleteServiceInstance,
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
        namespace: LuigiClient.getContext().namespaceId,
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
        >
          {`${serviceInstanceConstants.instanceDeleteConfirm} "${serviceInstance.name}"?`}
        </Modal>
      </Toolbar>

      <ServiceInstanceInfo serviceInstance={serviceInstance} />
    </ToolbarWrapper>
  );
};

export default ServiceInstanceHeader;
