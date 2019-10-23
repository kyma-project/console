import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import {
  NotificationMessage,
  Search,
  Spinner,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Panel,
  PanelBody,
  instancesTabUtils,
} from '@kyma-project/react-components';
import { StatusWrapper, StatusesList } from './styled';
import { Counter } from 'fundamental-react';

import { serviceClassConstants } from '../../variables';
import Cards from './Cards/Cards.component';

import {
  SearchWrapper,
  ServiceClassListWrapper,
  CardsWrapper,
  EmptyServiceListMessageWrapper,
  ServiceClassDescription,
} from './styled';

const determineDisplayedServiceClasses = (
  serviceClasses,
  tabIndex,
  searchQuery,
  activeLabels,
) => {
  console.log(
    'determineDisplayedServiceClasses serviceClasses',
    serviceClasses,
  );

  const searched = serviceClasses.filter(item =>
    new RegExp(searchQuery, 'i').test(item.name),
  );

  const filteredByLabels = searched.filter(item =>
    activeLabels.every(activeLabel => item.labels.includes(activeLabel)),
  );

  let filteredByTab = [];
  if (tabIndex === serviceClassConstants.addonsIndex) {
    filteredByTab = filteredByLabels.filter(item => {
      if (item.labels) {
        return item.labels.local === 'true';
      }
      return false;
    });
  }
  if (tabIndex === serviceClassConstants.servicesIndex) {
    filteredByTab = filteredByLabels.filter(item => {
      if (item.labels) {
        return item.labels.local !== 'true';
      }
      return true;
    });
  }

  return filteredByTab;
};

const determineSelectedTab = () => {
  const selectedTabName = LuigiClient.getNodeParams().selectedTab;
  return instancesTabUtils.convertTabNameToIndex(selectedTabName);
};

const handleTabChange = ({ defaultActiveTabIndex }) => {
  const selectedTabName = instancesTabUtils.convertIndexToTabName(
    defaultActiveTabIndex,
  );

  LuigiClient.linkManager()
    .withParams({ selectedTab: selectedTabName })
    .navigate('');
};

const status = (data, id) => {
  return (
    <StatusesList>
      <StatusWrapper key={id}>
        <Counter data-e2e-id={id}>{data}</Counter>
      </StatusWrapper>
    </StatusesList>
  );
};

class ServiceClassList extends React.Component {
  static propTypes = {
    classList: PropTypes.object.isRequired,
    serviceClasses: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    errorMessage: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      classFiltersLoaded: false,
    };
  }

  setTabFilter = currentTabIndex => {
    this.props.setServiceClassesFilter('local', currentTabIndex === 0);
  };

  render() {
    const {
      classList,
      serviceClasses,
      history,
      searchFn,
      errorMessage,
    } = this.props;
    const filteredClassesCounts =
      this.props.filteredClassesCounts.filteredClassesCounts || {};
    console.log('filteredClassesCounts', filteredClassesCounts);

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

    let items = classList.filteredServiceClasses || [];

    // TODO: Remove this nasty workaround for apparent bug
    // https://github.com/apollographql/apollo-client/issues/2920
    // Possible solution: do resolver logic on component side
    items = items.map(entry => {
      const remoteEntry = serviceClasses.find(remoteEntry => {
        if (remoteEntry.name) return remoteEntry.name === entry.name;
        if (remoteEntry.externalName) {
          return remoteEntry.externalName === entry.externalName;
        }
        return remoteEntry.displayName === entry.displayName;
      });

      return {
        ...entry,
        ...remoteEntry,
      };
    });

    //its used for filtering class which does not have any name in it (either externalName, displayName or name).
    items = items.filter(e => e.displayName || e.externalName || e.name);

    const newServices = determineDisplayedServiceClasses(
      items,
      serviceClassConstants.servicesIndex,
      '',
      [],
    );

    const newAddons = determineDisplayedServiceClasses(
      items,
      serviceClassConstants.addonsIndex,
      '',
      [],
    );

    console.log(
      'items',
      items,
      'newServices',
      newServices,
      'newAddons',
      newAddons,
    );

    const renderCards = () => {
      if (errorMessage) {
        return (
          <EmptyServiceListMessageWrapper>
            <NotificationMessage
              type="error"
              title="Error"
              message={errorMessage}
            />
          </EmptyServiceListMessageWrapper>
        );
      }

      if (items) {
        return items.length === 0 ? (
          <EmptyServiceListMessageWrapper>
            <Panel>
              <PanelBody>{serviceClassConstants.emptyListMessage}</PanelBody>
            </Panel>
          </EmptyServiceListMessageWrapper>
        ) : (
          <Cards data-e2e-id="cards" items={items} history={history} />
        );
      }
      return <Spinner />;
    };

    return (
      <>
        <Toolbar title={serviceClassConstants.title} background="#fff">
          <SearchWrapper>
            <Search
              noSearchBtn
              placeholder="Search"
              onChange={searchFn}
              data-e2e-id="search"
            />
          </SearchWrapper>
        </Toolbar>

        <Tabs
          defaultActiveTabIndex={determineSelectedTab()}
          callback={handleTabChange}
          borderType="none"
          noMargin
          customStyles
          hideSeparator
        >
          <Tab
            noMargin
            key="catalog-addons-tab"
            status={status(filteredClassesCounts.local, 'addons-status')}
            title={
              <Tooltip
                content={serviceClassConstants.addonsTooltipDescription}
                minWidth="100px"
                showTooltipTimeout={750}
                key="catalog-addons-tab-tooltip"
              >
                {serviceClassConstants.addons}
              </Tooltip>
            }
          >
            <>
              <ServiceClassDescription>
                {serviceClassConstants.addonsDescription}
                {/* {renderFilters()} */}
              </ServiceClassDescription>
              <ServiceClassListWrapper>
                <CardsWrapper data-e2e-id="cards">{renderCards()}</CardsWrapper>
              </ServiceClassListWrapper>
            </>
          </Tab>
          <Tab
            noMargin
            key="catalog-services-tab"
            status={status(filteredClassesCounts.notLocal, 'services-status')}
            title={
              <Tooltip
                content={serviceClassConstants.servicesTooltipDescription}
                minWidth="140px"
                showTooltipTimeout={750}
                key="catalog-services-tab-tooltip"
              >
                {serviceClassConstants.services}
              </Tooltip>
            }
          >
            <>
              <ServiceClassDescription>
                {serviceClassConstants.servicesDescription}
                {/* {renderFilters()} */}
              </ServiceClassDescription>
              <ServiceClassListWrapper>
                <CardsWrapper data-e2e-id="cards">{renderCards()}</CardsWrapper>
              </ServiceClassListWrapper>
            </>
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default ServiceClassList;
