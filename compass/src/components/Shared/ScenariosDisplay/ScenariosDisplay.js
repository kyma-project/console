import React from 'react';
import PropTypes from 'prop-types';
import { Token } from '@kyma-project/react-components';
import { EMPTY_TEXT_PLACEHOLDER } from '../../../shared/constants';

ScenariosDisplay.propTypes = {
  scenarios: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  className: PropTypes.string,
  emptyPlaceholder: PropTypes.string,
};

ScenariosDisplay.defaultProps = {
  emptyPlaceholder: EMPTY_TEXT_PLACEHOLDER,
};

export default function ScenariosDisplay({
  scenarios,
  className,
  emptyPlaceholder,
}) {
  if (!scenarios.length) {
    return <span className={className}>{emptyPlaceholder}</span>;
  }

  return (
    <span className={className}>
      {scenarios.map(scenario => (
        <Token
          key={scenario}
          className="y-fd-token y-fd-token--no-button fd-has-margin-right-tiny"
        >
          {scenario}
        </Token>
      ))}
    </span>
  );
}
