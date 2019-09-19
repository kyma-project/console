import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './AdvancedSettings.scss';
import { isLambdaContext } from '../../LogsContainer';

import { FormInput, Icon, InlineHelp } from 'fundamental-react';

AdvancedSettings.propTypes = {
  advancedSettings: PropTypes.object.isRequired,
  hideSettings: PropTypes.func.isRequired,
  updateFilteringState: PropTypes.func.isRequired,
};

const SettingsEntry = ({ name, children }) => {
  return (
    <div className="advanced_settings__entry">
      <p className="caption-muted">{name}</p>
      <div>{children}</div>
    </div>
  );
};

export default function AdvancedSettings({
  advancedSettings,
  hideSettings,
  updateFilteringState,
}) {
  const isLambda = useContext(isLambdaContext);

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

  const QueryInput = () => (
    <SettingsEntry name={<label htmlFor="query">Query</label>}>
      <FormInput
        id="query"
        type="text"
        onChange={setQuery}
        autoComplete="off"
        value={advancedSettings.query}
      />
    </SettingsEntry>
  );

  const ResultLimitInput = () => (
    <SettingsEntry
      name={
        <label htmlFor="result-limit">
          Result limit
          <span className="small-inline-help-wrapper">
            <InlineHelp
              placement="right"
              text="Return only limited number of most recent log lines."
            />
          </span>
        </label>
      }
    >
      <FormInput
        id="result-limit"
        type="number"
        onChange={setResultLimit}
        autoComplete="off"
        defaultValue={advancedSettings.resultLimit}
      />
    </SettingsEntry>
  );

  const PreviousLogsInput = () => (
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

  const HealthChecksInput = () => (
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

  const ShowIstioLogsInput = () => (
    <>
      <input
        type="checkbox"
        id="istio-logs"
        defaultChecked={advancedSettings.showIstioLogs}
        onChange={setShowPreviousLogs}
      />
      <label className="caption-muted" htmlFor="previous-logs">
        Istio logs
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
      <QueryInput />
      <ResultLimitInput />
      <SettingsEntry name="Show">
        {isLambda && (
          <>
            <PreviousLogsInput />
            <br />
            <HealthChecksInput />
            <br />
          </>
        )}
        <ShowIstioLogsInput />
      </SettingsEntry>
    </section>
  );
}
