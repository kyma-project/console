import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

import { Panel } from 'fundamental-react';

import SearchInput from './SearchInput/SearchInput';
import LabelsInput from './LabelsInput/LabelsInput';
import AdvancedSettings from './AdvancedSettings/AdvancedSettings';
import LabelsDisplay from './LabelsDisplay/LabelsDisplay';

Header.propTypes = {
  updateFilteringState: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  advancedSettings: PropTypes.object.isRequired,
};

export default function Header({
  updateFilteringState,
  searchPhrase,
  labels,
  advancedSettings,
}) {
  const [advancedShown, setAdvancedShown] = React.useState(false);

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
        <SearchInput
          searchPhrase={searchPhrase}
          updateFilteringState={updateFilteringState}
        />
        <LabelsInput
          labels={labels}
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
      <LabelsDisplay />
    </Panel>
  );
}
