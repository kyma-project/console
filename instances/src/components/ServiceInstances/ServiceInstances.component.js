import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import {
  NotificationMessage,
  Tab,
  Tabs,
  Tooltip,
  ThemeWrapper,
} from '@kyma-project/react-components';

import { serviceInstanceVariables } from './variables';
import ServiceInstancesTable from './ServiceInstancesTable/ServiceInstancesTable.component';
import ServiceInstancesToolbar from './ServiceInstancesToolbar/ServiceInstancesToolbar.component';

import { ServiceInstancesWrapper, StatusWrapper, Status } from './styled';
import { transformDataScalarStringsToObjects } from '../../store/transformers';

class ServiceInstances extends React.Component {
  setTabFilter = filterValue => {
    this.props.filterClassesAndSetActiveFilters('local', filterValue);
  };

  componentDidMount() {
    if (typeof this.props.filterItems === 'function') {
      this.props.filterItems();
    }
    setTimeout(() => {
      this.setTabFilter(true);
    }, 100);
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
      <StatusWrapper key={id}>
        <Status data-e2e-id={id}>{data}</Status>
      </StatusWrapper>
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
      const selectedTab = LuigiClient.getNodeParams().selectedTab;
      let selectedTabIndex = null;
      switch (selectedTab) {
        case 'addons':
          selectedTabIndex = 0;
          break;
        case 'services':
          selectedTabIndex = 1;
          break;
        default:
          selectedTabIndex = 0;
      }
      return selectedTabIndex;
    };

    const handleTabChange = ({ defaultActiveTabIndex }) => {
      defaultActiveTabIndex
        ? this.setTabFilter(false)
        : this.setTabFilter(true);
      // TODO: uncomment after https://github.com/kyma-project/luigi/issues/491 is done
      // let tabName = '';
      // switch (defaultActiveTabIndex) {
      //   case 0:
      //     tabName = 'addons';
      //     break;
      //   case 1:
      //     tabName = 'services';
      //     break;
      //   default:
      //     tabName = 'addons';
      // }
      // LuigiClient.linkManager()
      //   .withParams({ selectedTab: tabName })
      //   .navigate('');
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
          noBorder
          addonsView
        >
          <Tab
            noMargin
            aditionalStatus={this.status(
              filteredInstancesCounts.local,
              'addons-status',
            )}
            title={
              <Tooltip
                content={serviceInstanceVariables.addonsTooltipDescription}
                minWidth="100px"
                showTooltipTimeout={750}
                key="instances-addons-tab-tooltip"
              >
                {serviceInstanceVariables.addons}
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
            aditionalStatus={this.status(
              filteredInstancesCounts.notLocal,
              'services-status',
            )}
            title={
              <Tooltip
                content={serviceInstanceVariables.servicesTooltipDescription}
                minWidth="140px"
                showTooltipTimeout={750}
                key="instances-services-tab-tooltip"
              >
                {serviceInstanceVariables.services}
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
