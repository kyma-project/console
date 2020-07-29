import React from 'react';
import PropTypes from 'prop-types';

import { StatusBadge } from 'react-shared';

OAuthClientStatus.propTypes = {
  error: PropTypes.shape({
    code: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
};

export default function OAuthClientStatus({ error }) {
  if (!error) {
    return <StatusBadge type="success">OK</StatusBadge>;
  }

  const { code, description } = error;

  return (
    <StatusBadge type="error" tooltipContent={description}>
      {code}
    </StatusBadge>
  );
}
