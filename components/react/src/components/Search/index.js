import React from 'react';

import { SearchBox, SearchInput, SearchIcon } from './components';

const Search = ({
  darkBorder,
  backgroundColor,
  noIcon,
  placeholder,
  onChange,
  id,
}) => (
  <SearchBox darkBorder={darkBorder} backgroundColor={backgroundColor}>
    <SearchInput
      placeholder={placeholder}
      onChange={onChange}
      data-e2e-id={id || 'search'}
    />
    <SearchIcon noIcon={noIcon} />
  </SearchBox>
);

export default Search;
