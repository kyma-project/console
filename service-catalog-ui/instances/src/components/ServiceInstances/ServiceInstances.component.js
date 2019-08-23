import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import {
  NotificationMessage,
  Tab,
  Tabs,
  Tooltip,
  ThemeWrapper,
  instancesTabUtils,
} from '@kyma-project/react-components';
import { Counter } from 'fundamental-react';
import { StatusWrapper, StatusesList } from './styled';
import { serviceInstanceConstants } from '../../variables';
import ServiceInstancesTable from './ServiceInstancesTable/ServiceInstancesTable.component';
import ServiceInstancesToolbar from './ServiceInstancesToolbar/ServiceInstancesToolbar.component';

import { ServiceInstancesWrapper } from './styled';
import { transformDataScalarStringsToObjects } from '../../store/transformers';

class ServiceInstances extends React.Component {
  setTabFilter = currentTabIndex => {
    this.props.filterClassesAndSetActiveFilters('local', currentTabIndex === 0);
  };

  componentDidMount() {
    if (typeof this.props.filterItems === 'function') {
      this.props.filterItems();
    }
  }

  componentWillReceiveProps(newProps) {
    const { allItems } = newProps;
    const oldAllInstances =
      (this.props.allItems && this.props.allItems.serviceInstances) || {};
    if (
      typeof this.props.filterItems === 'function' &&
      allItems &&
      allItems.serviceInstances &&
      allItems.serviceInstances.length !== oldAllInstances.length
    ) {
      this.props.filterItems();
    }
  }

  status = (data, id) => {
    return (
      <StatusesList>
        <StatusWrapper key={id}>
          <Counter data-e2e-id={id}>{data}</Counter>
        </StatusWrapper>
      </StatusesList>
    );
  };

  render() {
    const {
      filterClassesAndSetActiveFilters,
      deleteServiceInstance,
      filteredItems = {},
      allFilters = {},
      activeFilters = {},
      allItems = {},
    } = this.props;
    const filteredInstancesCounts =
      this.props.filteredInstancesCounts.filteredInstancesCounts || {};

    if (allItems.loading || filteredItems.loading) {
      return null;
    }

    const allInstances = transformDataScalarStringsToObjects(
      allItems.serviceInstances,
    );

    const filters = allFilters.allFilters || [];
    const allActiveFilters = activeFilters.activeFilters || {};
    const labelFilter = filters.find(val => val.name === 'labels');

    let items;
    if (
      !allActiveFilters.search &&
      typeof allActiveFilters.local !== 'boolean' &&
      allActiveFilters.labels.length === 0
    ) {
      items = allInstances;
    } else {
      const filteredInstances = filteredItems.filteredItems || [];
      items = allInstances.filter(
        instance =>
          filteredInstances.findIndex(item => item.name === instance.name) !==
          -1,
      );
    }

    const determineSelectedTab = () => {
      const selectedTabName = LuigiClient.getNodeParams().selectedTab;
      const selectedTabIndex = instancesTabUtils.convertTabNameToIndex(
        selectedTabName,
      );

      this.setTabFilter(selectedTabIndex);
      return selectedTabIndex;
    };

    const handleTabChange = ({ defaultActiveTabIndex }) => {
      this.setTabFilter(defaultActiveTabIndex);

      const selectedTabName = instancesTabUtils.convertIndexToTabName(
        defaultActiveTabIndex,
      );

      LuigiClient.linkManager()
        .withParams({ selectedTab: selectedTabName })
        .navigate('');
    };

    return (
      <ThemeWrapper>
        <ServiceInstancesToolbar
          filterClassesAndSetActiveFilters={filterClassesAndSetActiveFilters}
          labelFilter={labelFilter}
          serviceInstancesExists={allInstances.length > 0}
        />

        <NotificationMessage
          type="error"
          title="Error"
          message={filteredItems.error && filteredItems.error.message}
        />

        <Tabs
          defaultActiveTabIndex={determineSelectedTab()}
          callback={handleTabChange}
          borderType="none"
          noMargin
          customStyles={`background-color: #fff;
          padding: 0 15px;`}
          hideSeparator
        >
          <Tab
            noMargin
            status={this.status(filteredInstancesCounts.local, 'addons-status')}
            title={
              <Tooltip
                content={serviceInstanceConstants.addonsTooltipDescription}
                minWidth="100px"
                showTooltipTimeout={750}
                key="instances-addons-tab-tooltip"
              >
                {serviceInstanceConstants.addons}
              </Tooltip>
            }
          >
            <ServiceInstancesWrapper data-e2e-id="instances-wrapper">
              <ServiceInstancesTable
                data={items}
                deleteServiceInstance={deleteServiceInstance}
              />
            </ServiceInstancesWrapper>
          </Tab>
          <Tab
            noMargin
            status={this.status(
              filteredInstancesCounts.notLocal,
              'services-status',
            )}
            title={
              <Tooltip
                content={serviceInstanceConstants.servicesTooltipDescription}
                minWidth="140px"
                showTooltipTimeout={750}
                key="instances-services-tab-tooltip"
              >
                {serviceInstanceConstants.services}
              </Tooltip>
            }
          >
            <ServiceInstancesWrapper data-e2e-id="instances-wrapper">
              <ServiceInstancesTable
                data={items}
                deleteServiceInstance={deleteServiceInstance}
              />
            </ServiceInstancesWrapper>
          </Tab>
        </Tabs>
      </ThemeWrapper>
    );
  }
}

export default ServiceInstances;
