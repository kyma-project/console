import React from 'react';

import { Toolbar } from '@kyma-project/react-components';

const ServiceBrokersToolbar = () => {
  return (
    <Toolbar
      headline="Service Brokers"
      description="You can view your brokers here"
    >
      {/*{serviceBrokersExists ? (*/}
      {/*<div>*/}
      {/*<SearchDropdown*/}
      {/*onChange={e =>*/}
      {/*filterClassesAndSetActiveFilters('search', e.target.value)*/}
      {/*}*/}
      {/*/>*/}
      {/*</div>*/}
      {/*) : null}*/}
    </Toolbar>
  );
};

export default ServiceBrokersToolbar;
