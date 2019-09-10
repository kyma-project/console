import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

import { Panel } from 'fundamental-react';

import SearchInput from './SearchInput/SearchInput';
import LabelsInput from './LabelsInput/LabelsInput';
import AdvancedSettings from './AdvancedSettings/AdvancedSettings';
import LabelsDisplay from './LabelsDisplay/LabelsDisplay';
import BottomToolbar from './BottomToolbar/BottomToolbar';

Header.propTypes = {
  updateFilteringState: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  sortDirection: PropTypes.oneOf(['ascending', 'descending']),
  readonlyLabels: PropTypes.array.isRequired,
  advancedSettings: PropTypes.object.isRequired,
};

export default function Header({
  updateFilteringState,
  searchPhrase,
  labels,
  sortDirection,
  readonlyLabels,
  advancedSettings,
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

  const advancedSettingsButtonText = advancedShown
    ? 'Hide Advanced Settings'
    : 'Show Advanced Settings';

  return (
    <Panel className="fd-has-padding-regular fd-has-padding-bottom-none">
      <h1 className="fd-has-type-3 fd-has-padding-bottom-tiny">Logs</h1>
      <section className="header__settings-group">
        <LabelsInput readonlyLabels={readonlyLabels} addLabel={addLabel} />
        <SearchInput
          searchPhrase={searchPhrase}
          updateFilteringState={updateFilteringState}
        />
        <span
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
        <BottomToolbar
          sortDirection={sortDirection}
          updateFilteringState={updateFilteringState}
        />
      </div>
    </Panel>
  );
}
