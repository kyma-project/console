import React from 'react';
import { StatusBadge } from 'react-shared';

export default function ApplicationStatus({ application }) {
  const status = (application && application.status) || STATUSES.NOT_INSTALLED;

  switch (status) {
    case STATUSES.NOT_INSTALLED:
      return (
        <p>
          <StatusBadge status={STATUSES.NOT_INSTALLED}>
            This application is not active for your Runtime. You can edit it,
            but you can't bind it to a Namespace.
          </StatusBadge>
        </p>
      );
    case 'SERVING':
      return <StatusBadge status={status} type="success" />;
    default:
      return <StatusBadge status={status} autoResolveType />;
  }
}

export const STATUSES = {
  NOT_INSTALLED: 'NOT_INSTALLED',
  INSTALLED: 'INSTALLED',
};
