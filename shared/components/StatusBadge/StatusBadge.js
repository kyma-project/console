import React from 'react';
import { Badge } from 'fundamental-react/Badge';
import PropTypes from 'prop-types';
import './StatusBadge.scss';
import classNames from 'classnames';
import { Tooltip } from '../Tooltip/Tooltip';

const resolveType = status => {
  if (typeof status !== 'string') {
    console.warn(
      `'autoResolveType' prop requires 'children' prop to be a string.`,
    );
    return undefined;
  }

  switch (status.toUpperCase()) {
    case 'INITIAL':
      return 'info';

    case 'READY':
    case 'RUNNING':
    case 'SUCCESS':
    case 'SUCCEEDED':
      return 'success';

    case 'UNKNOWN':
    case 'WARNING':
      return 'warning';

    case 'FAILED':
    case 'ERROR':
    case 'FAILURE':
      return 'error';

    default:
      return undefined;
  }
};

export const StatusBadge = ({
  tooltipContent,
  type,
  children: value,
  autoResolveType = false,
  tooltipProps = {},
  className,
}) => {
  if (autoResolveType) type = resolveType(value);

  const classes = classNames(
    'status-badge',
    {
      ['status-badge--' + type]: type,
      'has-tooltip': tooltipContent,
    },
    className,
  );

  const badgeElement = (
    <Badge role="status" modifier="filled" className={classes}>
      {value}
    </Badge>
  );

  return tooltipContent ? (
    <Tooltip content={tooltipContent} {...tooltipProps}>
      {badgeElement}
    </Tooltip>
  ) : (
    badgeElement
  );
};

StatusBadge.propTypes = {
  tooltipContent: PropTypes.node,
  type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  autoResolveType: PropTypes.bool,
  tooltipProps: PropTypes.object,
  className: PropTypes.string,
};
