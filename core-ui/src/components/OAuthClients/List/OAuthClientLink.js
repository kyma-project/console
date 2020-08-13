import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';
import { Link } from 'fundamental-react';

function goToClientDetails(name) {
  LuigiClient.linkManager().navigate(`details/${name}`);
}

OAuthClientLink.propTypes = { name: PropTypes.string.isRequired };

export default function OAuthClientLink({ name }) {
  return (
    <Link className="link" onClick={() => goToClientDetails(name)}>
      {name}
    </Link>
  );
}
