import React from 'react';

import { FormInput } from 'fundamental-react';
import { SearchWrapper } from '../components/ServiceClassList/ServiceClassToolbar/styled';

const SearchDropdown = ({ searchQuery, onChange }) => {
  return (
    <SearchWrapper>
      <FormInput
        value={searchQuery}
        type="text"
        placeholder="Search"
        onChange={onChange}
        data-e2e-id="search"
      />
    </SearchWrapper>
  );
};

export default SearchDropdown;
