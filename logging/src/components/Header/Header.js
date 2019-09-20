import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

import { Panel } from 'fundamental-react';

import SearchInput from './../Shared/SearchInput/SearchInput';
import LabelsInput from './../Shared/LabelsInput/LabelsInput';
import AdvancedSettings from './../Shared/AdvancedSettings/AdvancedSettings';
import LabelsDisplay from './../Shared/LabelsDisplay/LabelsDisplay';
import OptionsDropdown from './../Shared/SelectDropdown/SelectDropdown';
import AutoRefreshButton from './../Shared/AutoRefreshButton/AutoRefreshButton';
import { PERIODS, SORT_TYPES } from '../../constants';

Header.propTypes = {
  updateFilteringState: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  readonlyLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  logsPeriod: PropTypes.oneOf(PERIODS),
  sortDirection: PropTypes.oneOf(SORT_TYPES),
  advancedSettings: PropTypes.object.isRequired,
  autoRefreshEnabled: PropTypes.bool.isRequired,
};

export default function Header({
  updateFilteringState,
  searchPhrase,
  labels,
  readonlyLabels,
  logsPeriod,
  sortDirection,
  advancedSettings,
  autoRefreshEnabled,
}) {
  const [advancedShown, setAdvancedShown] = React.useState(false);

  function addLabel(label) {
    if (!labels.includes(label)) {
      updateFilteringState({ labels: [...labels, label] });
    }
  }

  function removeLabel(label) {
    updateFilteringState({ labels: labels.filter(l => l !== label) });
  }

  function removeAllLabels() {
    updateFilteringState({ labels: [] });
  }

  function toggleAdvancedSettingsVisibility() {
    setAdvancedShown(!advancedShown);
  }

  function updateLogsPeriod(logsPeriod) {
    updateFilteringState({ logsPeriod });
  }

  function updateSortDirection(sortDirection) {
    updateFilteringState({ sortDirection });
  }

  const advancedSettingsButtonText = advancedShown
    ? 'Hide Advanced Settings'
    : 'Show Advanced Settings';

  return (
    <Panel className="fd-has-padding-regular fd-has-padding-bottom-none">
      <h1 className="fd-has-type-3 fd-has-padding-bottom-tiny">Logs</h1>
      <section className="header__settings-group">
        <LabelsInput selectedLabels={labels} addLabel={addLabel} />
        <SearchInput
          searchPhrase={searchPhrase}
          updateFilteringState={updateFilteringState}
        />
        <span
          data-test-id="advanced-settings-toggle"
          className="link-button fd-has-type-minus-1 header__settings-group__toggle"
          onClick={toggleAdvancedSettingsVisibility}
        >
          {advancedSettingsButtonText}
        </span>
      </section>
      {advancedShown && (
        <AdvancedSettings
          advancedSettings={advancedSettings}
          hideSettings={() => setAdvancedShown(false)}
          updateFilteringState={updateFilteringState}
        />
      )}
      <div>
        <LabelsDisplay
          labels={labels}
          readonlyLabels={readonlyLabels}
          removeLabel={removeLabel}
          removeAll={removeAllLabels}
        />
        <div className="header__options-wrapper">
          <AutoRefreshButton
            autoRefreshEnabled={autoRefreshEnabled}
            updateParentState={updateFilteringState}
          />
          <OptionsDropdown
            availabelValues={PERIODS}
            currentValue={logsPeriod}
            icon="past"
            updateValue={updateLogsPeriod}
          />
          <OptionsDropdown
            availabelValues={SORT_TYPES}
            currentValue={sortDirection}
            icon="sort"
            updateValue={updateSortDirection}
          />
        </div>
      </div>
    </Panel>
  );
}
