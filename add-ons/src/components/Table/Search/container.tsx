import React, { useState, useRef, useContext, useEffect } from 'react';
import useClickOutside from 'click-outside-hook';

import { useInput } from '../../../services/Forms';
import ConfigurationsService from '../../../services/Configurations.service';
import FiltersService from '../../../services/Filters.service';

import Search from './component';

interface Props {}

const Container: React.FunctionComponent<Props> = () => {
  const { configurationsExist } = useContext(ConfigurationsService.Context);
  const {
    setSearchFilter,
    activeFilters: { search },
  } = useContext(FiltersService.Context);

  const searchField = useInput('');
  const [showSearchIcon, setShowSearchIcon] = useState<boolean>(true);

  const reference = useClickOutside(() => {
    if (!searchField.value) {
      setShowSearchIcon(true);
    }
  });

  useEffect(() => {
    setSearchFilter(searchField.value);
  }, [searchField.value]);

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

export default Container;
