import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './AdvancedSettings.scss';
import { isLambdaContext } from '../../LogsContainer';

import { FormInput, Icon, InlineHelp } from 'fundamental-react';
import { SearchParamsContext } from '../../Logs/SearchParams.reducer';

AdvancedSettings.propTypes = {
  hideSettings: PropTypes.func.isRequired,
};

const SettingsEntry = ({ name, children }) => {
  return (
    <div className="advanced_settings__entry">
      <p className="caption-muted">{name}</p>
      <div>{children}</div>
    </div>
  );
};

export default function AdvancedSettings({ hideSettings }) {
  const isLambda = useContext(isLambdaContext);
  const [state, actions] = useContext(SearchParamsContext);

  const QueryInput = () => (
    <SettingsEntry name={<label htmlFor="query">Query</label>}>
      <FormInput
        id="query"
        type="text"
        onChange={e => actions.setQuery(e.target.value)}
        autoComplete="off"
        value={state.query}
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
        onChange={e => actions.setResultLimit(e.target.value)}
        autoComplete="off"
        defaultValue={state.resultLimit}
      />
    </SettingsEntry>
  );

  const PreviousLogsInput = () => (
    <>
      <input
        type="checkbox"
        id="previous-logs"
        defaultChecked={state.showPreviousLogs}
        onChange={e => actions.setShowPreviousLogs(e.target.checked)}
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
        defaultChecked={state.showHealthChecks}
        onChange={e => actions.setShowHealthChecks(e.target.checked)}
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
        defaultChecked={state.showIstioLogs}
        onChange={e => actions.setShowIstioLogs(e.target.checked)}
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
          onClick={hideSettings}
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
