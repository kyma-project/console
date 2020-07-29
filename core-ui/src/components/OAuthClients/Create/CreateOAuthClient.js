import React from 'react';
import PropTypes from 'prop-types';

CreateOAuthClient.propTypes = { namespace: PropTypes.string.isRequired };

export default function CreateOAuthClient({ namespace }) {
  return <p>Create @ {namespace}</p>;
}
/*
grantTypes:
              description: GrantTypes is an array of grant types the client is allowed
                to use.
              items:
                enum:
                - client_credentials
                - authorization_code
                - implicit
                - refresh_token
                type: string
              maxItems: 4
              minItems: 1
              type: array
              */
const grantTypes = {
  client_credentials: 'Client credentials',
  authorization_code: 'Authorization code',
  implicit: 'Implicit',
  refresh_token: 'Refresh token',
};
// responseTypes:
//               description: ResponseTypes is an array of the OAuth 2.0 response type
//                 strings that the client can use at the authorization endpoint.
//               items:
//                 enum:
//                 - id_token
//                 - code
//                 - token
//                 type: string
//               maxItems: 3
//               minItems: 1
//               type: array
const responseTypes = {
  id_token: 'ID token',
  code: 'Code',
  token: 'Token',
};
