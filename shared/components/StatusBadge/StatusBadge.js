import React from 'react';
import { Badge } from 'fundamental-react/Badge';

export const StatusBadge = ({ status }) => {
  let type;

  switch (status) {
    case 'INITIAL':
      return <Badge>{status}</Badge>;
    case 'READY':
      type = 'success';
      break;
    case 'UNKNOWN':
      type = 'warning';
      break;
    case 'FAILED':
      type = 'error';
      break;
    default:
      type = 'warning';
  }

  return <Badge type={type}>{status}</Badge>;
};
