import React from 'react';
import { Badge, InlineHelp } from 'fundamental-react';

export default function ApplicationStatus({ application }) {
  const status = (application && application.status) || STATUSES.NOT_INSTALLED;

  switch (status) {
    case STATUSES.NOT_INSTALLED:
      return (
        <p>
          <Badge disabled modifier="filled">
            {STATUSES.NOT_INSTALLED}
          </Badge>
          <InlineHelp text="This application is not active for your Tenant. You can edit it, but you can't bind it to a Namespace." />
        </p>
      );
    case 'SERVING':
      return (
        <Badge type="success" modifier="filled">
          {status}
        </Badge>
      );
    default:
      return <Badge modifier="filled">{status}</Badge>;
  }
}

export const STATUSES = {
  NOT_INSTALLED: 'NOT_INSTALLED',
  INSTALLED: 'INSTALLED',
};
