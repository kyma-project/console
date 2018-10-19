import React from 'react';
import PropTypes from 'prop-types';

import {
  NotificationMessage,
  Paragraph,
  Search,
  Spinner,
  Toolbar,
} from '@kyma-project/react-components';

import FilterList from './FilterList/FilterList.component';
import ActiveFiltersList from './ActiveFiltersList/ActiveFiltersList.component';
import Cards from './Cards/Cards.component';

import {
  SearchWrapper,
  ServiceClassListWrapper,
  CardsWrapper,
  EmptyServiceListMessageWrapper,
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

  componentWillReceiveProps(newProps) {
    const { classFiltersLoaded } = this.state;

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
    const { filtersExists } = this.state;

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
      const remoteEntry = serviceClasses.find(
        remoteEntry =>
          remoteEntry.displayName === entry.displayName ||
          remoteEntry.externalName === entry.externalName ||
          remoteEntry.name === entry.name,
      );

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
            <Paragraph>No Service Classes found</Paragraph>
          </EmptyServiceListMessageWrapper>
        ) : (
          <Cards data-e2e-id="cards" items={items} history={history} />
        );
      }
      return (
        <Spinner
          padding="75px 0 50px 0"
          size="50px"
          color="rgba(50,54,58,0.6)"
        />
      );
    };

    return (
      <div>
        <Toolbar
          headline="Service Catalog"
          description="Enrich your experience with additional services"
        >
          <SearchWrapper>
            <Search
              noIcon
              darkBorder
              placeholder="Search"
              onChange={searchFn}
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

        {renderFilters()}

        <ServiceClassListWrapper>
          <CardsWrapper data-e2e-id="cards">{renderCards()}</CardsWrapper>
        </ServiceClassListWrapper>
      </div>
    );
  }
}

export default ServiceClassList;
