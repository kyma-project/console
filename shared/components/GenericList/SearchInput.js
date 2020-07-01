import React from 'react';
import PropTypes from 'prop-types';

import 'core-js/es/array/flat-map';

import { MESSAGES } from './constants';

SearchInput.propTypes = {
  searchQuery: PropTypes.string,
  entriesKind: PropTypes.string,
  entries: PropTypes.arrayOf(PropTypes.object.isRequired),
  handleQueryChange: PropTypes.func.isRequired,
  suggestionProperties: PropTypes.arrayOf(PropTypes.string.isRequired)
    .isRequired,
  showSuggestion: PropTypes.bool,
  showSearchControl: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default function SearchInput({
  searchQuery,
  entriesKind,
  filteredEntries,
  handleQueryChange,
  suggestionProperties,
  showSuggestion = true,
  showSearchControl = true,
  disabled = false,
}) {
  const [isSearchHidden, setSearchHidden] = React.useState(true);
  const searchInputRef = React.useRef();

  const renderSearchList = entries => {
    const suggestions = getSearchSuggestions(entries);

    if (!suggestions.length) {
      return (
        <li
          key="no-entries"
          className="fd-menu__item fd-menu__item--no-entries"
        >
          {MESSAGES.NO_SEARCH_RESULT}
        </li>
      );
    }

    return suggestions.map(suggestion => (
      <li
        onClick={() => handleQueryChange(suggestion)}
        key={suggestion}
        className="fd-menu__item"
      >
        {suggestion}
      </li>
    ));
  };

  const getSearchSuggestions = entries => {
    const suggestions = entries
      .flatMap(entry => {
        if (typeof entry === 'string') {
          if (entryMatchesSearch(entry)) return entry;
        }
        return suggestionProperties.map(property => {
          const entryValue = entry[property];
          if (entryMatchesSearch(entryValue)) return entryValue;
        });
      })
      .filter(suggestion => suggestion);
    return Array.from(new Set(suggestions));
  };

  const entryMatchesSearch = entry => {
    return (
      entry &&
      entry
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  };

  const openSearchList = () => {
    setSearchHidden(false);
    setImmediate(() => {
      const inputField = searchInputRef.current;
      inputField.focus();
    });
  };

  const checkForEscapeKey = e => {
    const ESCAPE_KEY_CODE = 27;
    if (e.keyCode === ESCAPE_KEY_CODE) {
      setSearchHidden(true);
    }
  };

  const showControl = showSearchControl && isSearchHidden && !searchQuery;
  return (
    <section
      className="generic-list-search"
      role="search"
      aria-label={`search-${entriesKind}`}
    >
      <div
        className="fd-popover"
        style={{ display: showControl ? 'none' : 'initial' }}
      >
        <div className="fd-popover__control">
          <div className="fd-combobox-control">
            <input
              aria-label="search-input"
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onBlur={() => setSearchHidden(true)}
              onFocus={() => setSearchHidden(false)}
              onChange={e => handleQueryChange(e.target.value)}
              onKeyPress={checkForEscapeKey}
              className="fd-has-margin-right-tiny"
            />
            {!!searchQuery && showSuggestion && (
              <div
                className="fd-popover__body fd-popover__body--no-arrow"
                aria-hidden={isSearchHidden}
              >
                <nav className="fd-menu">
                  <ul className="fd-menu__list">
                    {renderSearchList(filteredEntries)}
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
      {showControl && (
        <button
          disabled={disabled}
          className={`fd-button--light sap-icon--search ${
            disabled ? 'is-disabled' : ''
          }`}
          onClick={openSearchList}
          aria-label={`open-search`}
        />
      )}
    </section>
  );
}
