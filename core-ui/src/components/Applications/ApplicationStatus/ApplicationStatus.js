import React from 'react';
import { StatusBadge } from 'react-shared';

export default function ApplicationStatus({ application }) {
  const status = (application && application.status) || STATUSES.NOT_INSTALLED;

  switch (status) {
    case STATUSES.NOT_INSTALLED:
      return (
        <StatusBadge tooltipContent="This application is not active for your Runtime. You can edit it, but you can't bind it to a Namespace.">
          {status}
        </StatusBadge>
      );
    case 'SERVING':
      return <StatusBadge type="success">{status}</StatusBadge>;
    default:
      return <StatusBadge autoResolveType>{status}</StatusBadge>;
  }
}

export const STATUSES = {
  NOT_INSTALLED: 'NOT_INSTALLED',
  INSTALLED: 'INSTALLED',
};
