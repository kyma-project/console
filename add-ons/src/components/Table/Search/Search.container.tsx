import React, { useState, useContext, useEffect } from 'react';
import useClickOutside from 'click-outside-hook';

import { useInput } from '../../../services/Forms';
import { ConfigurationsService, FiltersService } from '../../../services';

import Search from './Search.component';

const SearchContainer: React.FunctionComponent = () => {
  const { configurationsExist } = useContext(ConfigurationsService);
  const { setSearchFilter } = useContext(FiltersService);

  const searchField = useInput('');
  const [showSearchIcon, setShowSearchIcon] = useState<boolean>(true);

  const reference = useClickOutside(() => {
    if (!searchField.value) {
      setShowSearchIcon(true);
    }
  });

  useEffect(() => {
    setSearchFilter(searchField.value);
  }, [searchField.value, setSearchFilter]);

  return (
    <Search
      searchField={searchField}
      configurationsExist={configurationsExist()}
      showSearchIcon={showSearchIcon}
      setShowSearchIcon={setShowSearchIcon}
      reference={reference}
    />
  );
};

export default SearchContainer;
