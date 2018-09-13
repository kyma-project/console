import React from 'react';
import PropTypes from 'prop-types';

import {
  Paragraph,
  Search,
  Spinner,
  Toolbar,
} from '@kyma-project/react-components';

import { SearchWrapper } from './styled';

import FilterList from './FilterList/FilterList.component';
import Cards from './Cards/Cards.component';

import {
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
    setServiceClassesFilter: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(newProps) {
    if (
      newProps.serviceClasses &&
      newProps.serviceClasses.length > 0 &&
      typeof newProps.filterServiceClasses === 'function'
    ) {
      newProps.filterServiceClasses();
    }
  }

  render() {
    const {
      classList,
      activeClassFilters,
      activeTagsFilters,
      classFilters,
      setServiceClassesFilter,
      history,
      searchFn,
      filterTagsAndSetActiveFilters,
    } = this.props;

    const filterFn = e =>
      filterTagsAndSetActiveFilters('search', e.target.value);

    const seeMoreFn = (key, value) => {
      filterTagsAndSetActiveFilters(key, value);
      filterTagsAndSetActiveFilters('offset', 0);
    };

    const activeFilters = activeClassFilters.activeServiceClassFilters || {};
    const activeCategoriesFilters = activeTagsFilters.activeTagsFilters || {};
    const activeFiltersCount =
      activeFilters.provider.length + activeFilters.tag.length;
    let items = classList.filteredServiceClasses || [];

    //its used for filtering class which does not have any name in it (either externalName, displayName or name).
    items = items.filter(e => e.displayName || e.externalName || e.name);

    const renderCards = () => {
      if (items) {
        return items.length === 0 ? (
          <EmptyServiceListMessageWrapper>
            <Paragraph>No Service Classes found.</Paragraph>
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
              active={activeFilters}
              activeFiltersCount={activeFiltersCount}
              activeTagsFilters={activeCategoriesFilters}
              onChange={(key, value) => setServiceClassesFilter(key, value)}
              onSearch={filterFn}
              onSeeMore={seeMoreFn}
            />
          )}
        </Toolbar>

        <ServiceClassListWrapper>
          <CardsWrapper data-e2e-id="cards">{renderCards()}</CardsWrapper>
        </ServiceClassListWrapper>
      </div>
    );
  }
}

export default ServiceClassList;
