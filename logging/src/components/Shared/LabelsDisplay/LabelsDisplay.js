import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import './LabelsDisplay.scss';
import { SearchParamsContext } from '../../Logs/SearchParams.reducer';
import { Token } from 'fundamental-react';

function getLabelsExceptOne(allLabels, labelToRemove) {
  return allLabels.filter(l => l !== labelToRemove);
}

export default function LabelsDisplay({}) {
  const [{ readonlyLabels, labels }, actions] = useContext(SearchParamsContext);

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
            <Token
              className="caption-muted"
              onClick={() =>
                actions.setLabels(getLabelsExceptOne(labels, label))
              }
            >
              {label}
            </Token>
          </li>
        ))}
      </ul>
      {!!labels.length && (
        <span
          data-test-id="clear-all"
          className="link-button fd-has-type-minus-1 fd-has-margin-left-tiny"
          onClick={() => actions.setLabels([])}
        >
          Clear All
        </span>
      )}
    </section>
  );
}
