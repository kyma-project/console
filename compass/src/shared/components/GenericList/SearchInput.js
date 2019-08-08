import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { withDuplicatesRemoved } from './helpers';

SearchInput.propTypes = {
  searchQuery: PropTypes.string,
  entries: PropTypes.arrayOf(PropTypes.object.isRequired),
  handleQueryChange: PropTypes.func.isRequired,
};

export default function SearchInput({
  searchQuery,
  filteredEntries,
  handleQueryChange,
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
          No entries found
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
        const headers = ['name', 'description'];
        return headers.map(header => {
          const entryValue = entry[header];
          if (entryValue && entryValue.includes(searchQuery)) {
            return entryValue;
          }
          return null;
        });
      })
      .filter(suggestion => suggestion);
    return withDuplicatesRemoved(suggestions);
  };

  const searchInputChanged = e => {
    const searchQuery = e.target.value;
    handleQueryChange(searchQuery);
  };

  const openSearchList = () => {
    const inputField = searchInputRef.current;
    if (inputField !== document.activeElement) {
      inputField.focus();
    }
  };

  const setInputFocus = isFocused => () => {
    setSearchHidden(!isFocused);
  };

  return (
    <div className="fd-search-input generic-list-search">
      <div className="fd-popover">
        <div className="fd-popover__control">
          <div className="fd-combobox-control">
            <div className="fd-input-group fd-input-group--after">
              <input
                ref={searchInputRef}
                type="text"
                className="fd-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={searchInputChanged}
                onFocus={setInputFocus(true)}
                onBlur={setInputFocus(false)}
              />
              <span className="fd-input-group__addon fd-input-group__addon--after fd-input-group__addon--button">
                <button
                  className="fd-button--light sap-icon--search"
                  onClick={openSearchList}
                ></button>
              </span>
            </div>
          </div>
        </div>
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
      </div>
    </div>
  );
}
