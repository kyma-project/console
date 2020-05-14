import React from 'react';

import { FormInput } from 'fundamental-react';
import { SearchWrapper } from './styled';

const SearchDropdown = ({ onChange }) => {
  return (
    <SearchWrapper>
      <FormInput
        type="text"
        placeholder="Search"
        onChange={onChange}
        data-e2e-id="search"
      />
    </SearchWrapper>
  );
};

export default SearchDropdown;
