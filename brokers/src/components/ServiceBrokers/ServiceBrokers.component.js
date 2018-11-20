import React from 'react';

import {
  NotificationMessage,
  ThemeWrapper,
} from '@kyma-project/react-components';

import ServiceBrokersTable from './ServiceBrokersTable/ServiceBrokersTable.component';
import ServiceBrokersToolbar from './ServiceBrokersToolbar/ServiceBrokersToolbar.component';

import { ServiceBrokersWrapper } from './styled';

class ServiceBrokers extends React.Component {
  render() {
    const { serviceBrokers = {} } = this.props;

    const brokers = serviceBrokers.serviceBrokers || [];

    return (
      <ThemeWrapper>
        <ServiceBrokersToolbar serviceBrokersExists={brokers.length > 0} />
        <NotificationMessage
          type="error"
          title="Error"
          message={serviceBrokers.error && serviceBrokers.error.message}
        />
        <ServiceBrokersWrapper data-e2e-id="brokers-wrapper">
          <ServiceBrokersTable
            data={brokers}
            refetch={serviceBrokers.refetch}
            loading={serviceBrokers.loading}
          />
        </ServiceBrokersWrapper>
      </ThemeWrapper>
    );
  }
}

export default ServiceBrokers;
