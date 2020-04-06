import React from 'react';
import PropTypes from 'prop-types';

import 'core-js/es/array/flat-map';

SearchInput.propTypes = {
  searchQuery: PropTypes.string,
  handleQueryChange: PropTypes.func.isRequired,
};

export default function SearchInput({ searchQuery, handleQueryChange }) {
  const [isSearchHidden, setSearchHidden] = React.useState(true);
  const searchInputRef = React.useRef();

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

  const showControl = isSearchHidden && !searchQuery;
  return (
    <section className="generic-list-search" role="search">
      <div
        className="fd-popover"
        style={{ display: showControl ? 'none' : 'initial' }}
      >
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
        </div>
      </div>
      {showControl && (
        <button
          className="fd-button--light sap-icon--search"
          onClick={openSearchList}
          aria-label="open-search"
        />
      )}
    </section>
  );
}
