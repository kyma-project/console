import React from 'react';
import './LabelsDisplay.scss';

import { Token } from 'fundamental-react';

export default function LabelsDisplay(props) {
  const samplelabels = ['namespace="demo"', 'function="hasselhoff'];

  function removeLabel(label) {
    console.log(label);
  }

  function removeAllLabels() {
    console.log('remove all');
  }

  return (
    <section className="labels-display">
      <ul>
        {samplelabels.map(label => (
          <li key={label}>
            <Token className="caption-muted" onClick={() => removeLabel(label)}>
              {label}
            </Token>
          </li>
        ))}
      </ul>
      {samplelabels.length && (
        <span
          className="link-button fd-has-type-minus-1 fd-has-margin-left-tiny"
          onClick={() => removeAllLabels()}
        >
          Clear All
        </span>
      )}
    </section>
  );
}
