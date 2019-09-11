import React from 'react';
import PropTypes from 'prop-types';
import './AdvancedSettings.scss';

import { FormInput, Icon, InlineHelp } from 'fundamental-react';

AdvancedSettings.propTypes = {
  advancedSettings: PropTypes.object.isRequired,
  hideSettings: PropTypes.func.isRequired,
  updateFilteringState: PropTypes.func.isRequired,
};

export default function AdvancedSettings({
  advancedSettings,
  hideSettings,
  updateFilteringState,
}) {
  const settingsEntry = (name, controls) => {
    return (
      <div className="advanced_settings__entry">
        <p className="caption-muted advanced_settings__entry-name">{name}</p>{' '}
        <div className="advanced_settings__entry_name-control">{controls}</div>
      </div>
    );
  };

  function updateState(data) {
    updateFilteringState({
      advancedSettings: {
        ...advancedSettings,
        ...data,
      },
    });
  }

  function setShowPreviousLogs(e) {
    updateState({ showPreviousLogs: e.target.checked });
  }

  function setHealthChecks(e) {
    updateState({ showHealthChecks: e.target.checked });
  }

  function setQuery(e) {
    updateState({ query: e.target.value });
  }

  function setResultLimit(e) {
    updateState({ resultLimit: e.target.value });
  }
  //todo KRZYWO
  const queryInput = settingsEntry(
    <label htmlFor="query">Query</label>,
    <FormInput
      id="query"
      type="text"
      onChange={setQuery}
      autoComplete="off"
      defaultValue={advancedSettings.query}
    />,
  );

  const resultLimitInput = settingsEntry(
    <label htmlFor="result-limit">
      Result limit
      <span className="small-inline-help-wrapper">
        <InlineHelp
          placement="right"
          text="Return only limited number of most recent log lines."
        />
      </span>
    </label>,
    <FormInput
      id="result-limit"
      type="number"
      onChange={setResultLimit}
      autoComplete="off"
      defaultValue={advancedSettings.query}
    />,
  );

  const previousLogsInput = (
    <>
      <input
        type="checkbox"
        id="previous-logs"
        defaultChecked={advancedSettings.showPreviousLogs}
        onChange={setShowPreviousLogs}
      />
      <label className="caption-muted" htmlFor="previous-logs">
        logs of previous lambda version
      </label>
    </>
  );

  const healthChecksInput = (
    <>
      <input
        type="checkbox"
        id="health-checks"
        defaultChecked={advancedSettings.showHealthChecks}
        onChange={setHealthChecks}
      />
      <label className="caption-muted" htmlFor="health-checks">
        health check
      </label>
    </>
  );

  return (
    <section className="advanced_settings">
      <h2 className="advanced_settings__header">
        Advanced Settings
        <Icon
          glyph="decline"
          size="s"
          className="cursor-pointer"
          onClick={() => hideSettings()}
        />
      </h2>
      {queryInput}
      {resultLimitInput}
      {settingsEntry(
        'Show',
        <>
          {previousLogsInput}
          <br />
          {healthChecksInput}
        </>,
      )}
    </section>
  );
}
