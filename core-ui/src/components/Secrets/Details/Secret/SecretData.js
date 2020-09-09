import React from 'react';
import PropTypes from 'prop-types';

import { Button, Panel, FormItem, FormLabel } from 'fundamental-react';
import './SecretData.scss';

const SecretComponent = ({ name, value, showEncoded }) => (
  <FormItem className="item-wrapper">
    <FormLabel>{name}</FormLabel>
    {showEncoded ? btoa(value) : value}
  </FormItem>
);

SecretData.propTypes = {
  secret: PropTypes.object.isRequired,
};

export default function SecretData({ secret }) {
  const [isEncoded, setEncoded] = React.useState(true);

  const body = () => {
    const SecretWrapper = ({ children }) => (
      <div className="secret-wrapper">{children}</div>
    );

    if (!secret) {
      return <SecretWrapper>Secret not found.</SecretWrapper>;
    }
    if (!secret.data) {
      return <SecretWrapper>Invalid secret.</SecretWrapper>;
    }

    return (
      <>
        {Object.keys(secret.data).map(key => (
          <SecretComponent
            name={key}
            key={key}
            value={secret.data[key]}
            showEncoded={isEncoded}
          />
        ))}
      </>
    );
  };

  return (
    <Panel className="fd-has-margin-m secret-panel">
      <Panel.Header>
        <Panel.Head title={'Data'} />
        <Panel.Actions>
          <Button
            option="light"
            glyph={isEncoded ? 'show' : 'hide'}
            disabled={!secret?.data}
            onClick={() => setEncoded(!isEncoded)}
          >
            {isEncoded ? 'Decode' : 'Hide decoded'}
          </Button>
        </Panel.Actions>
      </Panel.Header>
      {body()}
    </Panel>
  );
}
