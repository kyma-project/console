import React, { useContext } from 'react';
import './Header.scss';

import { Panel } from 'fundamental-react';

import SearchInput from './../Shared/SearchInput/SearchInput';
import LabelsInput from './../Shared/LabelsInput/LabelsInput';
import AdvancedSettings from './../Shared/AdvancedSettings/AdvancedSettings';
import LabelsDisplay from './../Shared/LabelsDisplay/LabelsDisplay';
import OptionsDropdown from './../Shared/SelectDropdown/SelectDropdown';
import AutoRefreshButton from './../Shared/AutoRefreshButton/AutoRefreshButton';
import { PERIODS, SORT_TYPES } from '../../constants';
import { SearchParamsContext } from '../Logs/SearchParams.reducer';

export default function Header() {
  const [advancedShown, setAdvancedShown] = React.useState(false);
  const [state, actions] = useContext(SearchParamsContext);

  const { logsPeriod, sortDirection } = state;

  function toggleAdvancedSettingsVisibility() {
    setAdvancedShown(!advancedShown);
  }

  const advancedSettingsButtonText = advancedShown
    ? 'Hide Advanced Settings'
    : 'Show Advanced Settings';

  return (
    <Panel className="fd-has-padding-regular fd-has-padding-bottom-none">
      <h1 className="fd-has-type-3 fd-has-padding-bottom-tiny">Logs</h1>
      <section className="header__settings-group">
        <LabelsInput />
        <SearchInput />
        <span
          data-test-id="advanced-settings-toggle"
          className="link-button fd-has-type-minus-1 header__settings-group__toggle"
          onClick={toggleAdvancedSettingsVisibility}
          role="button"
        >
          {advancedSettingsButtonText}
        </span>
      </section>
      {advancedShown && (
        <AdvancedSettings hideSettings={() => setAdvancedShown(false)} />
      )}

      <div>
        <LabelsDisplay />
        <div className="header__options-wrapper">
          <AutoRefreshButton />
          <OptionsDropdown
            availabelValues={PERIODS}
            icon="past"
            currentValue={logsPeriod}
            updateValue={actions.setLogsPeriod}
          />
          <OptionsDropdown
            availabelValues={SORT_TYPES}
            icon="sort"
            currentValue={sortDirection}
            updateValue={actions.setSortDir}
          />
        </div>
      </div>
    </Panel>
  );
}
