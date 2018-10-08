import React from 'react';

import {
  NotificationMessage,
  ThemeWrapper,
} from '@kyma-project/react-components';

import ServiceInstancesTable from './ServiceInstancesTable/ServiceInstancesTable.component';
import ServiceInstancesToolbar from './ServiceInstancesToolbar/ServiceInstancesToolbar.component';

import { ServiceInstancesWrapper } from './styled';

class ServiceInstances extends React.Component {
  componentWillReceiveProps(newProps) {
    if (
      newProps.serviceInstances &&
      newProps.serviceInstances.serviceInstances &&
      newProps.serviceInstances.serviceInstances.length > 0 &&
      typeof newProps.filterItems === 'function' &&
      !newProps.serviceInstances.serviceInstances.error &&
      newProps.filteredItems &&
      newProps.filteredItems.filteredItems &&
      !newProps.filteredItems.filteredItems.error
    ) {
      newProps.filterItems();
    }
  }

  render() {
    const {
      filterClassesAndSetActiveFilters,
      deleteServiceInstance,
      filteredItems = {},
      allFilters = {},
      activeFilters = {},
      serviceInstances = {},
    } = this.props;

    const allItems = serviceInstances.serviceInstances || [];
    const items = filteredItems.filteredItems || [];

    const filters = allFilters.allFilters || [];
    const allActiveFilters = activeFilters.activeFilters || {};
    const labelFilter = filters.find(val => val.name === 'labels');

    // TODO: Remove this nasty workaround for apparent bug
    // https://github.com/apollographql/apollo-client/issues/2920
    // Possible solution: do resolver logic on component side
    const entries = items.map(entry => {
      const remoteEntry = allItems.find(
        remoteEntry => remoteEntry.name === entry.name,
      );

      return {
        ...entry,
        ...remoteEntry,
      };
    });

    return (
      <ThemeWrapper>
        <ServiceInstancesToolbar
          filterClassesAndSetActiveFilters={filterClassesAndSetActiveFilters}
          labelFilter={labelFilter}
          allActiveFilters={allActiveFilters}
          serviceInstancesExists={allItems.length > 0}
        />

        <NotificationMessage
          type="error"
          title="Error"
          message={serviceInstances.error && serviceInstances.error.message}
        />
        <NotificationMessage
          type="error"
          title="Error"
          message={filteredItems.error && filteredItems.error.message}
        />

        <ServiceInstancesWrapper data-e2e-id="instances-wrapper">
          <ServiceInstancesTable
            data={entries}
            deleteServiceInstance={deleteServiceInstance}
            refetch={serviceInstances.refetch}
            loading={serviceInstances.loading}
          />
        </ServiceInstancesWrapper>
      </ThemeWrapper>
    );
  }
}

export default ServiceInstances;
