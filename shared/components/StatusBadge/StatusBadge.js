import React from 'react';
import { Badge } from 'fundamental-react/Badge';
import PropTypes from 'prop-types';
import './StatusBadge.scss';
import classNames from 'classnames';
import { Tooltip } from '../Tooltip/Tooltip';

const resolveType = status => {
  switch (status.toUpperCase()) {
    case 'INITIAL':
      return 'info';

    case 'READY':
    case 'RUNNING':
    case 'SUCCESS':
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
  status,
  type,
  children,
  autoResolveType = false,
  tooltipProps = {},
}) => {
  if (autoResolveType) type = resolveType(status);

  const classes = classNames('status-badge', {
    ['status-badge--' + type]: type,
    'has-tooltip': children,
  });

  const badgeElement = (
    <Badge role="status" modifier="filled" className={classes}>
      {status}
    </Badge>
  );

  if (children)
    return (
      <Tooltip content={children} {...tooltipProps}>
        {badgeElement}
      </Tooltip>
    );
  else return badgeElement;
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  autoResolveType: PropTypes.bool,
};
