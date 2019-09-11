import React from 'react';
import PropTypes from 'prop-types';
import './LabelsDisplay.scss';

import { Token } from 'fundamental-react';

LabelsDisplay.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  readonlyLabels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  removeLabel: PropTypes.func.isRequired,
  removeAll: PropTypes.func.isRequired,
};

export default function LabelsDisplay({
  labels,
  readonlyLabels,
  removeLabel,
  removeAll,
}) {
  return (
    <section className="labels-display">
      <ul>
        {readonlyLabels.map(label => (
          <li key={label}>
            <Token className="caption-muted y-fd-token--no-button">
              {label}
            </Token>
          </li>
        ))}
        {labels.map(label => (
          <li key={label}>
            <Token className="caption-muted" onClick={() => removeLabel(label)}>
              {label}
            </Token>
          </li>
        ))}
      </ul>
      {!!labels.length && (
        <span
          className="link-button fd-has-type-minus-1 fd-has-margin-left-tiny"
          onClick={() => removeAll()}
        >
          Clear All
        </span>
      )}
    </section>
  );
}
