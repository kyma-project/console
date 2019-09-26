import React from 'react';
import './Header.scss';

import { Panel } from 'fundamental-react';

import SearchInput from './../Shared/SearchInput/SearchInput';
import LabelsInput from './../Shared/LabelsInput/LabelsInput';
import AdvancedSettings from './../Shared/AdvancedSettings/AdvancedSettings';
import LabelsDisplay from './../Shared/LabelsDisplay/LabelsDisplay';
import SelectDropdown from './../Shared/SelectDropdown/SelectDropdown';
import AutoRefreshButton from './../Shared/AutoRefreshButton/AutoRefreshButton';
import { PERIODS, SORT_DROPDOWN_VALUES } from '../../constants';
import { useSearchParams } from '../Logs/SearchParams.reducer';

export default function Header() {
  const [advancedShown, setAdvancedShown] = React.useState(false);
  const [state, actions] = useSearchParams();

  const { logsPeriod, sortDirection } = state;

  function toggleAdvancedSettingsVisibility() {
    setAdvancedShown(!advancedShown);
  }

  const advancedSettingsButtonText = advancedShown
    ? 'Hide Advanced Settings'
    : 'Show Advanced Settings';

  return (
    <Panel className="fd-has-padding-bottom-none header">
      <h1 className="fd-has-type-3 fd-has-padding-bottom-tiny fd-has-padding-top-regular fd-has-padding-right-regular fd-has-padding-left-regular ">
        Logs
      </h1>
      <section className="header__settings-group fd-has-padding-right-regular fd-has-padding-left-regular ">
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

      <div
        className={
          'header-toolbar fd-has-padding-right-regular fd-has-padding-left-regular '
        }
      >
        <LabelsDisplay />
        <div>
          <AutoRefreshButton />
          <SelectDropdown
            availableValues={PERIODS}
            icon="past"
            currentValue={logsPeriod}
            updateValue={actions.setLogsPeriod}
          />
          <SelectDropdown
            availableValues={SORT_DROPDOWN_VALUES}
            icon="sort"
            currentValue={sortDirection}
            updateValue={actions.setSortDir}
          />
        </div>
      </div>
    </Panel>
  );
}
