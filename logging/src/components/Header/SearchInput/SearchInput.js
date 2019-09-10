import React from 'react';
import PropTypes from 'prop-types';
import './SearchInput.scss';

import { Search } from '@kyma-project/react-components';
import { InlineHelp } from 'fundamental-react';

SearchInput.propTypes = {
  updateFilteringState: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
};

export default function SearchInput({ updateFilteringState, searchPhrase }) {
  function updateSearchQuery(event) {
    const value = event.target.value;
    updateFilteringState({ searchPhrase: value });
  }

  return (
    <section>
      <span className="caption-muted search-input__caption">
        Search
        <div className="small-inline-help-wrapper">
          <InlineHelp placement="right" text="Search for logs by text (optional)" />
        </div>
      </span>
      <Search onChange={updateSearchQuery} value={searchPhrase} />
    </section>
  );
}
