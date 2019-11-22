import React from 'react';
import { Token } from 'fundamental-react';
import './LabelDisplay.scss';

interface LabelDisplayProps {
  readonlyLabels?: { [key: string]: any };
  labels?: { [key: string]: any };
}

const LabelDisplay: React.FunctionComponent<LabelDisplayProps> = ({
  readonlyLabels,
  labels,
}) => (
  <section className="labels-display">
    <ul>
      {readonlyLabels &&
        Object.keys(readonlyLabels).map((key: string) => (
          <li key={key}>
            <Token className="caption-muted caption--no-button">{`${key}=${readonlyLabels[key]}`}</Token>
          </li>
        ))}
      {labels &&
        Object.keys(labels).map((key: string) => (
          <li key={key}>
            <Token className="caption-muted">{`${key}=${labels[key]}`}</Token>
          </li>
        ))}
    </ul>
  </section>
);

export default LabelDisplay;
