import React from 'react';
import PropTypes from 'prop-types';

EditOAuthClient.propTypes = {
  name: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
};

export default function EditOAuthClient({ name, namespace }) {
  return (
    <p>
      Edit {name} @ {namespace}
    </p>
  );
}
