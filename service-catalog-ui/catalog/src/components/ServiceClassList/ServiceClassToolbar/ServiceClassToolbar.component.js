import React from 'react';

import { serviceClassConstants } from '../../../variables';
import { Toolbar } from '@kyma-project/react-components';

import SearchDropdown from './SearchDropdown.component';

const ServiceClassToolbar = ({ searchFn, serviceClassesExists }) => {
  return (
    <Toolbar background="#fff" title={serviceClassConstants.title}>
      {serviceClassesExists ? (
        <SearchDropdown onChange={e => searchFn(e.target.value)} />
      ) : null}
    </Toolbar>
  );
};

export default ServiceClassToolbar;
