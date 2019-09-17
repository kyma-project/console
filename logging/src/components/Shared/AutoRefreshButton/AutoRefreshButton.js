import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@kyma-project/react-components';

AutoRefreshButton.propTypes = {
  autoRefreshEnabled: PropTypes.bool.isRequired,
  updateParentState: PropTypes.func.isRequired,
};

export default function AutoRefreshButton({
  autoRefreshEnabled,
  updateParentState,
}) {
  function toggleAutoRefresh() {
    updateParentState({ autoRefreshEnabled: !autoRefreshEnabled });
  }

  return (
    <Button
      className="link-button fd-has-margin-right-tiny fd-has-type-minus-1"
      glyph={autoRefreshEnabled ? 'media-pause' : 'media-play'}
      option="light"
      size="xs"
      onClick={() => toggleAutoRefresh()}
      data-test-id="auto-refresh-button"
    >
      auto refresh
    </Button>
  );
}
