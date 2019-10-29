import React from 'react';
import PropTypes from 'prop-types';
import { Token } from '@kyma-project/react-components';

LabelDisplay.propTypes = {
  className: PropTypes.string,
  labels: PropTypes.object.isRequired,
};

export default function LabelDisplay(props) {
  return (
    <span className={props.className}>
      {Object.keys(props.labels).map(label => (
        <Token
          key={label}
          className="y-fd-token y-fd-token--no-button fd-has-margin-right-tiny"
        >
          {props.labels[label].length
            ? `${label}=[${props.labels[label].join(', ')}]`
            : label}
        </Token>
      ))}
    </span>
  );
}
