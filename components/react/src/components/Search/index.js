import React from 'react';

import { SearchBox, SearchInput, SearchIcon } from './components';

const Search = ({ placeholder, onChange }) => (
  <SearchBox>
    <SearchInput
      placeholder={placeholder}
      onChange={onChange}
      data-e2e-id="search"
    />
    <SearchIcon />
  </SearchBox>
);

export default Search;
