import React from 'react';

import {
  NotificationMessage,
  Spinner,
  ThemeWrapper,
} from '@kyma-project/react-components';

import ServiceInstanceToolbar from './ServiceInstanceToolbar/ServiceInstanceToolbar.component';
import ServiceInstanceInfo from './ServiceInstanceInfo/ServiceInstanceInfo.component';
import ServiceInstanceBindings from './ServiceInstanceBindings/ServiceInstanceBindings.container';
import ServiceInstanceTabs from './ServiceInstanceTabs/ServiceInstanceTabs.component';

import { ServiceInstanceWrapper, EmptyList } from './styled';

class ServiceInstanceDetails extends React.Component {
  render() {
    const { serviceInstance = {}, deleteServiceInstance, history } = this.props;

    const instance =
      serviceInstance.serviceInstance && serviceInstance.serviceInstance;
    const serviceClass =
      instance && instance.serviceClass && instance.serviceClass;

    if (serviceInstance.loading) {
      return (
        <EmptyList>
          <Spinner size="40px" color="#32363a" />
        </EmptyList>
      );
    }
    if (!serviceInstance.loading && !instance) {
      return <EmptyList>Service Instance doesn't exist</EmptyList>;
    }
    return (
      <ThemeWrapper>
        <ServiceInstanceToolbar
          serviceInstance={instance}
          deleteServiceInstance={deleteServiceInstance}
          history={history}
        />

        <NotificationMessage
          type="error"
          title="Error"
          message={serviceInstance.error && serviceInstance.error.message}
        />

        <ServiceInstanceWrapper>
          <ServiceInstanceInfo serviceInstance={instance} />
          <ServiceInstanceBindings
            serviceInstance={instance}
            serviceInstanceRefetch={serviceInstance.refetch}
          />
          {serviceClass.content ||
          serviceClass.apiSpec ||
          serviceClass.asyncApiSpec ? (
            <ServiceInstanceTabs serviceClass={serviceClass} />
          ) : null}
        </ServiceInstanceWrapper>
      </ThemeWrapper>
    );
  }
}

export default ServiceInstanceDetails;
