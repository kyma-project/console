import React from 'react';

import { serviceInstanceConstants } from 'helpers/constants';
import { Toolbar } from '@kyma-project/react-components';

import SearchDropdown from 'shared/SearchDropdown.component';

const ServiceInstanceToolbar = ({
  searchQuery,
  searchFn,
  serviceInstancesExists,
}) => {
  return (
    <Toolbar
      background="#fff"
      title={serviceInstanceConstants.title}
      aria-label="title"
    >
      {serviceInstancesExists ? (
        <>
          <SearchDropdown
            searchQuery={searchQuery}
            onChange={e => searchFn(e.target.value)}
          />
        </>
      ) : null}
    </Toolbar>
  );
};

export default ServiceInstanceToolbar;
