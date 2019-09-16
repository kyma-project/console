import React from 'react';
import PropTypes from 'prop-types';

import { ComboboxInput } from 'fundamental-react/ComboboxInput';

import DropdownRenderer from './DropdownRenderer/DropdownRenderer';
import { HttpServiceContext } from '../../../services/httpService';

import { LOG_LABEL_CATEGORIES } from '../../../constants';

LabelsInput.propTypes = {
  addLabel: PropTypes.func.isRequired,
  maxRecentCount: PropTypes.number,
};

LabelsInput.defaultProps = {
  maxRecentCount: 4,
};

export default function LabelsInput({ addLabel, maxRecentCount }) {
  const [recentLabels, setRecentLabels] = React.useState([]);
  const [logLabelCategories, setLogLabelsCategories] = React.useState(
    LOG_LABEL_CATEGORIES,
  );
  const { getLabels } = React.useContext(HttpServiceContext);

  function updateRecentLabels(label) {
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
    addLabel(label);
    updateRecentLabels(label);
  }

  return (
    <section className="fd-display-l-inline-block">
      <span className="caption-muted">Labels</span>
      <ComboboxInput
        menu={
          <DropdownRenderer
            recentLabels={recentLabels}
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
