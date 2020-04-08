import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'fundamental-react';
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
        <Badge
          key={scenario}
          className="fd-has-margin-right-tiny fd-has-background-color-background-1 fd-has-color-text-3"
          modifier="filled"
        >
          {scenario}
        </Badge>
      ))}
    </span>
  );
}
