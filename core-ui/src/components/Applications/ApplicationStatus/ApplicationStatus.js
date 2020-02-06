import React from 'react';
import { Badge, InlineHelp } from 'fundamental-react';
import { EMPTY_TEXT_PLACEHOLDER } from 'react-shared';

export default function ApplicationStatus({ application }) {
  const status =
    application === null
      ? STATUSES.NOT_INSTALLED
      : application && application.status;

  switch (status) {
    case null:
    case undefined:
      return EMPTY_TEXT_PLACEHOLDER;
    case STATUSES.NOT_INSTALLED:
      return (
        <p>
          <Badge disabled modifier="filled">
            {status}
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
