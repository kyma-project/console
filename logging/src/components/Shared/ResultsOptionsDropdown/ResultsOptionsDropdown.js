import React from 'react';
import PropTypes from 'prop-types';
import './ResultOptionsDropdown.scss';

import {
  Popover,
  Button,
  FormLabel,
  FormInput,
  FormItem,
  FormSet,
} from 'fundamental-react';

ResultOptionsDropdown.propTypes = {
  advancedSettings: PropTypes.object.isRequired,
  updateFilteringState: PropTypes.func.isRequired,
};

export default function ResultOptionsDropdown({
  advancedSettings,
  updateFilteringState,
}) {
  function updateState(data) {
    updateFilteringState({
      advancedSettings: {
        ...advancedSettings,
        ...data,
      },
    });
  }

  function setShowPreviousLogs(e) {
    const value = e.target.checked;
    updateState({ showPreviousLogs: value });
  }

  function setShowHealthChecks(e) {
    const value = e.target.checked;
    updateState({ setShowHealthChecks: value });
  }

  const popoverContent = (
    <FormSet id="result-options">
      <FormItem className="fd-has-margin-small">
        <FormInput
          type="checkbox"
          id="previous-logs"
          defaultChecked={advancedSettings.showPreviousLogs}
          onChange={setShowPreviousLogs}
        />
        <FormLabel
          className="caption-muted fd-has-margin-left-tiny"
          htmlFor="previous-logs"
        >
          logs of previous lambda version
        </FormLabel>
      </FormItem>
      <FormItem className="fd-has-margin-small">
        <FormInput
          type="checkbox"
          id="health-checks"
          defaultChecked={advancedSettings.showHealthChecks}
          onChange={setShowHealthChecks}
        />
        <FormLabel
          className="caption-muted fd-has-margin-left-tiny"
          htmlFor="health-checks"
        >
          health checks
        </FormLabel>
      </FormItem>
    </FormSet>
  );

  return (
    <span className="link-button fd-has-type-minus-1">
      <Popover
        body={popoverContent}
        control={
          <Button
            glyph="action-settings"
            option="light"
            className="fd-has-margin-right-tiny"
            size="xs"
          ></Button>
        }
        placement="bottom-end"
      />
    </span>
  );
}
