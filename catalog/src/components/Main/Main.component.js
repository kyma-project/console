import React from 'react';
import PropTypes from 'prop-types';

import { ThemeWrapper } from '@kyma-project/react-components';

import ServiceClassList from '../ServiceClassList/ServiceClassList.container';

import { MainWrapper } from './styled';

const MainPage = ({
  history,
  clusterServiceClasses,
  filterClasses,
  filterClassesAndSetActiveFilters,
  filterFilters,
}) => {
  const searchFn = e =>
    filterClassesAndSetActiveFilters('search', e.target.value);

  return (
    <ThemeWrapper>
      <MainWrapper>
        {!clusterServiceClasses.loading && (
          <ServiceClassList
            clusterServiceClasses={clusterServiceClasses.clusterServiceClasses}
            filterServiceClasses={filterClasses}
            setServiceClassesFilter={filterClassesAndSetActiveFilters}
            history={history}
            searchFn={searchFn}
          />
        )}
      </MainWrapper>
    </ThemeWrapper>
  );
};

MainPage.propTypes = {
  history: PropTypes.object.isRequired,
  clusterServiceClasses: PropTypes.object.isRequired,
  filterClasses: PropTypes.func.isRequired,
  filterClassesAndSetActiveFilters: PropTypes.func.isRequired,
};

export default MainPage;
