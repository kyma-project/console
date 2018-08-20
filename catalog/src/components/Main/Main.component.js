import React from 'react';
import PropTypes from 'prop-types';

import { Toolbar, ThemeWrapper, Search } from '@kyma-project/react-components';

import ServiceClassList from '../ServiceClassList/ServiceClassList.container';

import { MainWrapper, SearchWrapper } from './styled';

const MainPage = ({
  history,
  serviceClasses,
  filterClasses,
  filterClassesAndSetActiveFilters,
}) => {
  const searchFn = e =>
    filterClassesAndSetActiveFilters('search', e.target.value);

  return (
    <ThemeWrapper>
      <MainWrapper>
        <Toolbar
          back={() => {
            history.goBack();
          }}
          largeBackButton
          headline="Service Catalog"
          description="Enrich your experience with additional services"
        >
          <SearchWrapper>
            <Search placeholder="Search" onChange={searchFn} />
          </SearchWrapper>
        </Toolbar>

        {!serviceClasses.loading && (
          <ServiceClassList
            serviceClasses={serviceClasses.serviceClasses}
            filterServiceClasses={filterClasses}
            setServiceClassesFilter={filterClassesAndSetActiveFilters}
            history={history}
          />
        )}
      </MainWrapper>
    </ThemeWrapper>
  );
};

MainPage.propTypes = {
  history: PropTypes.object.isRequired,
  serviceClasses: PropTypes.object.isRequired,
  filterClasses: PropTypes.func.isRequired,
  filterClassesAndSetActiveFilters: PropTypes.func.isRequired,
};

export default MainPage;
