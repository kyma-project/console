import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import equal from 'deep-equal';

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
} from '@kyma-project/react-components';

import { serviceClassConstants } from '../../variables';
import FilterList from './FilterList/FilterList.component';
import ActiveFiltersList from './ActiveFiltersList/ActiveFiltersList.component';
import Cards from './Cards/Cards.component';

import {
  SearchWrapper,
  ServiceClassListWrapper,
  CardsWrapper,
  EmptyServiceListMessageWrapper,
  ServiceClassDescription,
  StatusWrapper,
  Status,
} from './styled';

class ServiceClassList extends React.Component {
  static propTypes = {
    activeClassFilters: PropTypes.object.isRequired,
    classList: PropTypes.object.isRequired,
    classFilters: PropTypes.object.isRequired,
    serviceClasses: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    filterServiceClasses: PropTypes.func.isRequired,
    clearAllActiveFilters: PropTypes.func.isRequired,
    setServiceClassesFilter: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      classFiltersLoaded: false,
      filtersExists: {
        basic: false,
        tag: false,
        provider: false,
        connectedApplication: false,
      },
    };
  }

  setTabFilter = filterValue => {
    this.props.setServiceClassesFilter('local', filterValue);
  };

  componentDidMount() {
    setTimeout(() => {
      this.setTabFilter(true);
    }, 100);
  }

  componentWillReceiveProps(newProps) {
    const { classFiltersLoaded } = this.state;
    if (equal(this.props, newProps)) return;

    if (
      newProps.serviceClasses &&
      newProps.serviceClasses.length &&
      typeof newProps.filterServiceClasses === 'function'
    ) {
      newProps.filterServiceClasses();
    }

    if (
      !classFiltersLoaded &&
      newProps.classFilters &&
      newProps.classFilters.serviceClassFilters &&
      newProps.classFilters.serviceClassFilters.length
    ) {
      this.checkExistsOfFilters(newProps.classFilters.serviceClassFilters);
    }
  }

  checkExistsOfFilters = filters => {
    let filtersExists = {
      basic: false,
      tag: false,
      provider: false,
      connectedApplication: false,
    };

    filters.forEach(element => {
      if (element.values.length > 1) filtersExists[element.name] = true;
    });

    this.setState({
      classFiltersLoaded: true,
      filtersExists: filtersExists,
    });
  };

  status = (data, id) => {
    return (
      <StatusWrapper key={id}>
        <Status data-e2e-id={id}>{data}</Status>
      </StatusWrapper>
    );
  };

  render() {
    const {
      classList,
      activeClassFilters,
      activeTagsFilters,
      classFilters,
      clearAllActiveFilters,
      serviceClasses,
      setServiceClassesFilter,
      history,
      searchFn,
      filterTagsAndSetActiveFilters,
      errorMessage,
    } = this.props;
    const filteredClassesCounts =
      this.props.filteredClassesCounts.filteredClassesCounts || {};
    const { filtersExists } = this.state;

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

    const filterFn = e => {
      filterTagsAndSetActiveFilters('search', e.target.value);
    };

    const seeMoreFn = (key, value) => {
      filterTagsAndSetActiveFilters(key, value);
      filterTagsAndSetActiveFilters('offset', 0);
    };

    const activeFilters = activeClassFilters.activeServiceClassFilters || {};
    const activeCategoriesFilters = activeTagsFilters.activeTagsFilters || {};
    const activeFiltersCount =
      activeFilters.basic.length +
      activeFilters.provider.length +
      activeFilters.tag.length +
      activeFilters.connectedApplication.length;
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

    const renderFilters = () => {
      if (!activeFiltersCount) return null;

      return (
        <ActiveFiltersList
          activeFilters={activeFilters}
          clearAllActiveFilters={clearAllActiveFilters}
          onCancel={(key, value) => setServiceClassesFilter(key, value)}
        />
      );
    };

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

          {!classFilters.loading && (
            <FilterList
              filters={classFilters.serviceClassFilters}
              filtersExists={filtersExists}
              active={activeFilters}
              activeFiltersCount={activeFiltersCount}
              activeTagsFilters={activeCategoriesFilters}
              clearAllActiveFilters={clearAllActiveFilters}
              onChange={(key, value) => setServiceClassesFilter(key, value)}
              onSearch={filterFn}
              onSeeMore={seeMoreFn}
            />
          )}
        </Toolbar>

        <Tabs
          defaultActiveTabIndex={determineSelectedTab()}
          callback={handleTabChange}
          noBorder
          addonsView
        >
          <Tab
            noMargin
            key="catalog-addons-tab"
            aditionalStatus={this.status(
              filteredClassesCounts.local,
              'addons-status',
            )}
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
                {renderFilters()}
              </ServiceClassDescription>
              <ServiceClassListWrapper>
                <CardsWrapper data-e2e-id="cards">{renderCards()}</CardsWrapper>
              </ServiceClassListWrapper>
            </>
          </Tab>
          <Tab
            noMargin
            key="catalog-services-tab"
            aditionalStatus={this.status(
              filteredClassesCounts.notLocal,
              'services-status',
            )}
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
                {renderFilters()}
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
