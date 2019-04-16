import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import {
  NotificationMessage,
  Tab,
  Tabs,
  Tooltip,
  ThemeWrapper,
} from '@kyma-project/react-components';

import ServiceInstancesTable from './ServiceInstancesTable/ServiceInstancesTable.component';
import ServiceInstancesToolbar from './ServiceInstancesToolbar/ServiceInstancesToolbar.component';

import { ServiceInstancesWrapper } from './styled';
import { transformDataScalarStringsToObjects } from '../../store/transformers';

class ServiceInstances extends React.Component {
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

  render() {
    const {
      filterClassesAndSetActiveFilters,
      deleteServiceInstance,
      filteredItems = {},
      allFilters = {},
      activeFilters = {},
      allItems = {},
    } = this.props;

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
    if (!allActiveFilters.search && allActiveFilters.labels.length === 0) {
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

    const handleTabChange = ({defaultActiveTabIndex}) => {
      let tabName = '';
      switch (defaultActiveTabIndex) {
        case 0:
          tabName = 'addons';
          break;
        case 1:
          tabName = 'services';
          break;
        default:
          tabName = 'addons';
      }
      LuigiClient.linkManager().withParams({selectedTab: tabName}).navigate('');
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

        <ServiceInstancesWrapper data-e2e-id="instances-wrapper">
          <Tabs defaultActiveTabIndex={determineSelectedTab()} callback={handleTabChange}>
            <Tab
              title={
                <Tooltip
                  content="PITUPITU"
                  minWidth="140px"
                  showTooltipTimeout={750}
                  key="instances-addons-tab-tooltip"
                >
                  Add-Ons
                </Tooltip>
              }
            >
              <ServiceInstancesTable
                data={items}
                deleteServiceInstance={deleteServiceInstance}
              />
            </Tab>
            <Tab
              title={
                <Tooltip
                  content="PITUPITU"
                  minWidth="140px"
                  showTooltipTimeout={750}
                  key="instances-services-tab-tooltip"
                >
                  Services
                </Tooltip>
              }
            >
              <ServiceInstancesTable
                data={items}
                deleteServiceInstance={deleteServiceInstance}
              />
            </Tab>
          </Tabs>
        </ServiceInstancesWrapper>
      </ThemeWrapper>
    );
  }
}

export default ServiceInstances;
