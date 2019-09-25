import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './AdvancedSettings.scss';
import { LambdaNameContext, useLambdaName } from '../../Logs/Logs';
import QueryInput from '../QueryInput/QueryInput';

import { FormInput, Icon, InlineHelp } from 'fundamental-react';
import {
  SearchParamsContext,
  useSearchParams,
} from '../../Logs/SearchParams.reducer';

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

export const ResultLimitInput = ({ state, actions }) => (
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

const PreviousLogsInput = ({ state, actions }) => (
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

export const HealthChecksInput = ({ state, actions }) => (
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

const ShowIstioLogsInput = ({ state, actions }) => (
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

export default function AdvancedSettings({ hideSettings }) {
  const lambdaName = useLambdaName();
  const [state, actions] = useSearchParams();

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
      <SettingsEntry name={<label htmlFor="query">Query</label>}>
        <QueryInput labels={state.labels} setLabelsAction={actions.setLabels} />
      </SettingsEntry>
      <ResultLimitInput state={state} actions={actions} />
      <SettingsEntry name="Show">
        {!!lambdaName && (
          <>
            {/* <PreviousLogsInput state={state} actions={actions} />
            <br /> */}
            <HealthChecksInput state={state} actions={actions} />
            <br />
          </>
        )}
        <ShowIstioLogsInput state={state} actions={actions} />
      </SettingsEntry>
    </section>
  );
}
