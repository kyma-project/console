import React from 'react';

import { Search } from '@kyma-project/react-components';
import { SearchWrapper } from './styled';

const SearchDropdown = ({ onChange }) => {
  return (
    <SearchWrapper>
      <Search
        noSearchBtn
        placeholder="Search"
        onChange={onChange}
        data-e2e-id="search"
      />
    </SearchWrapper>
  );
};

export default SearchDropdown;
