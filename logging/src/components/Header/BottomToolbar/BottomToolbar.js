import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'fundamental-react';

BottomToolbar.propTypes = {
  sortDirection: PropTypes.oneOf(['ascending', 'descending']).isRequired,
  updateFilteringState: PropTypes.func.isRequired,
};

export default function BottomToolbar({ sortDirection, updateFilteringState }) {
  function switchSortDirection() {
    updateFilteringState({
      sortDirection: sortDirection === 'ascending' ? 'descending' : 'ascending',
    });
  }

  return (
    <div>
      <span className="link-button fd-has-type-minus-1 fd-has-margin-right-small">
        <Icon glyph="sort" className="fd-has-margin-right-tiny" size="s" />
        last hour
      </span>
      <span
        className="link-button fd-has-type-minus-1"
        onClick={() => switchSortDirection()}
      >
        <Icon glyph="past" size="s" /> {sortDirection}
      </span>
    </div>
  );
}
