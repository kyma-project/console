import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { ComboboxInput } from 'fundamental-react/ComboboxInput';

import DropdownRenderer from './DropdownRenderer/DropdownRenderer';
import { HttpServiceContext } from '../../../services/httpService';
import { SearchParamsContext } from '../../Logs/SearchParams.reducer';

import { LOG_LABEL_CATEGORIES } from '../../../constants';
const localStorageKey = 'recent_log_labels';
LabelsInput.propTypes = {
  maxRecentCount: PropTypes.number,
};

LabelsInput.defaultProps = {
  maxRecentCount: 4,
};

function setRecentLabels(labels) {
  localStorage.setItem(localStorageKey, JSON.stringify(labels));
}

function getRecentLabels() {
  const storageLabels = localStorage.getItem(localStorageKey);
  return storageLabels ? JSON.parse(storageLabels) : [];
}

export default function LabelsInput({ maxRecentCount }) {
  const [state, actions] = useContext(SearchParamsContext);

  const [logLabelCategories, setLogLabelsCategories] = React.useState(
    LOG_LABEL_CATEGORIES.map(c => ({ name: c })),
  );
  const { getLabels } = React.useContext(HttpServiceContext);

  function updateRecentLabels(label) {
    const recentLabels = getRecentLabels();

    if (!recentLabels.includes(label)) {
      const newRecentLabels = [...recentLabels].filter(l => l !== label);
      newRecentLabels.unshift(label);
      newRecentLabels.splice(maxRecentCount);
      setRecentLabels(newRecentLabels);
    }
  }

  async function loadLabels(category) {
    const labels = await getLabels(category);

    setLogLabelsCategories(
      [...logLabelCategories].map(c =>
        c.name === category
          ? {
              ...c,
              labels,
            }
          : c,
      ),
    );
    return labels;
  }

  function chooseLabel(label) {
    actions.addLabel(label);
    updateRecentLabels(label);
  }

  return (
    <section className="fd-display-l-inline-block">
      <span className="caption-muted">Labels</span>
      <ComboboxInput
        menu={
          <DropdownRenderer
            selectedLabels={state.labels}
            recentLabels={getRecentLabels()}
            logLabelCategories={logLabelCategories}
            chooseLabel={chooseLabel}
            loadLabels={loadLabels}
          />
        }
        placeholder="Select Label"
      />
    </section>
  );
}
