import React from 'react';
import { Badge } from 'fundamental-react/Badge';
import PropTypes from 'prop-types';
import './StatusBadge.scss';
import classNames from 'classnames';

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

export const StatusBadge = ({ status, type, autoResolveType = false }) => {
  if (autoResolveType) type = resolveType(status);

  return (
    <>
      <Badge
        modifier="filled"
        className={classNames('status-badge', {
          ['status-badge--' + type]: type,
        })}
      >
        {status}
      </Badge>
    </>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  autoResolveType: PropTypes.bool,
};
