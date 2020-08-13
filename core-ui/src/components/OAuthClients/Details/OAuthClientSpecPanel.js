import React from 'react';
import PropTypes from 'prop-types';

import { Panel, Token, FormItem, FormLabel } from 'fundamental-react';
import { grantTypes, responseTypes } from '../common';

OAuthClientSpecPanel.propTypes = { spec: PropTypes.object.isRequired };

const Tokens = ({ tokens }) => (
  <div>
    {tokens.map(scope => (
      <Token
        key={scope}
        style={{ marginTop: '4px' }}
        className="y-fd-token y-fd-token--no-button y-fd-token--gap"
      >
        {scope}
      </Token>
    ))}
  </div>
);

export default function OAuthClientSpecPanel({ spec }) {
  return (
    <Panel className="fd-has-margin-m oauth-client-panel">
      <Panel.Header>
        <Panel.Head title="Configuration" />
      </Panel.Header>
      <FormItem>
        <FormLabel>Response types</FormLabel>
        <Tokens tokens={spec.responseTypes.map(v => responseTypes[v])} />
      </FormItem>
      <FormItem>
        <FormLabel>Grant types</FormLabel>
        <Tokens tokens={spec.grantTypes.map(v => grantTypes[v])} />
      </FormItem>
      <FormItem>
        <FormLabel>Scope</FormLabel>
        <Tokens tokens={spec.scope.split(' ').filter(scope => scope)} />
      </FormItem>
    </Panel>
  );
}
