import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SearchInput.scss';
import { SearchParamsContext } from '../../Logs/SearchParams.reducer';

import { InlineHelp } from 'fundamental-react';

SearchInput.propTypes = {
  compact: PropTypes.bool,
};

SearchInput.defaultProps = {
  compact: false,
};

export default function SearchInput({ compact }) {
  const [state, actions] = useContext(SearchParamsContext);

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
        onChange={e => actions.setSearchPhrase(e.target.value)}
        value={state.searchPhrase}
        placeholder="Search"
        id="search-input"
      />
    </section>
  );
}
