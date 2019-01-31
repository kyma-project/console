import React from 'react';

import { Search } from '@kyma-project/react-components';

const SearchDropdown = ({ onChange }) => {
  return (
    <Search
      noSearchBtn
      placeholder="Search"
      onChange={onChange}
      data-e2e-id="search"
    />
  );
};

export default SearchDropdown;
