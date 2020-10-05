import React from 'react';
import { Link } from '../Link/Link';

export const LogsLink = ({
  domain,
  query,
  from = 'now-1h',
  to = 'now',
  dataSource = 'Loki',
  mode = 'Logs',
}) => {
  if (!domain) {
    return null;
  }
  const queryParameters = query ? { expr: query } : {};
  const parameters = [
    from,
    to,
    dataSource,
    queryParameters,
    {
      mode: mode,
    },
    {
      ui: [true, true, true, 'none'],
    },
  ];
  const grafanaLink = `https://grafana.${domain}/explore?left=${JSON.stringify(
    parameters,
  )}`;

  return <Link className="fd-button" url={grafanaLink} text="Logs" />;
};
