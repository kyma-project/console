import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SearchInput.scss';

import { InlineHelp } from 'fundamental-react';

SearchInput.propTypes = {
  updateFilteringState: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  compact: PropTypes.bool,
};

SearchInput.defaultProps = {
  compact: false,
};

export default function SearchInput({
  updateFilteringState,
  searchPhrase,
  compact,
}) {
  function updateSearchQuery(event) {
    const value = event.target.value;
    updateFilteringState({ searchPhrase: value });
  }
  return (
    <section className="fd-has-margin-right-small">
      <span className="caption-muted search-input__caption">
        {!compact && (
          <>
            Search
            <div className="small-inline-help-wrapper">
              <InlineHelp
                placement="right"
                text="Search for logs by text (optional)"
              />
            </div>
          </>
        )}
      </span>
      <input
        type="text"
        className={classNames({ 'search-input--compact': compact })}
        onChange={updateSearchQuery}
        value={searchPhrase}
        placeholder="Search"
        id="search-input"
        min="0"
      />
    </section>
  );
}
