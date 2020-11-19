import React from 'react';

import { serviceClassConstants } from 'helpers/constants';
import { Toolbar } from '@kyma-project/react-components';

import SearchDropdown from '../../../shared/SearchDropdown.component';

const ServiceClassToolbar = ({
  searchFn,
  serviceClassesExists,
  searchQuery,
}) => {
  return (
    <Toolbar
      background="#fff"
      title={serviceClassConstants.title}
      aria-label="title"
    >
      {serviceClassesExists && (
        <SearchDropdown
          searchQuery={searchQuery}
          onChange={e => searchFn(e.target.value)}
        />
      )}
    </Toolbar>
  );
};

export default ServiceClassToolbar;
