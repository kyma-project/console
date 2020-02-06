import React from 'react';
import { Badge, InlineHelp } from 'fundamental-react';
import { EMPTY_TEXT_PLACEHOLDER } from 'react-shared';

export default function ApplicationStatus({ application }) {
  const status =
    application === null
      ? 'NOT_INSTALLED'
      : (application && application.status) || EMPTY_TEXT_PLACEHOLDER;

  switch (status) {
    case 'NOT_INSTALLED':
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
