import React from 'react';
import PropTypes from 'prop-types';

import { Button, Panel, FormItem, FormLabel } from 'fundamental-react';
import './SecretData.scss';

const SecretComponent = ({ name, value, showEncoded, isCollapsed }) => (
  <FormItem className="item-wrapper">
    <FormLabel>{name}</FormLabel>
    <div className={isCollapsed ? 'show-more-expand' : 'show-more-collapse'}>
      {showEncoded ? btoa(value) : value}
    </div>
  </FormItem>
);

SecretData.propTypes = {
  secret: PropTypes.object.isRequired,
};

export default function SecretData({ secret }) {
  const [isEncoded, setEncoded] = React.useState(true);
  const [isCollapsed, setCollapsed] = React.useState(true);
  const [showExpandButton, setShowExpandButton] = React.useState(false);

  const decode = () => {
    setEncoded(true);
  };
  const encode = () => {
    setEncoded(false);
    setCollapsed(false);
  };

  const setShowExpand = async () => {
    const e = await document.getElementsByClassName('show-more-expand');

    [...e].forEach(el => {
      if (el.scrollWidth > el.clientWidth) {
        setShowExpandButton(true);
      }
    });
  };

  setShowExpand();

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
            isCollapsed={isCollapsed}
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
          {showExpandButton && (
            <Button
              option="light"
              glyph={isCollapsed ? 'show' : 'hide'}
              disabled={!secret?.data}
              onClick={() => setCollapsed(!isCollapsed)}
            >
              {isCollapsed ? 'Expand all' : 'Collapse all'}
            </Button>
          )}
          <Button
            option="light"
            glyph={isEncoded ? 'show' : 'hide'}
            disabled={!secret?.data}
            onClick={() => {
              return isEncoded ? encode() : decode();
            }}
          >
            {isEncoded ? 'Decode' : 'Encode'}
          </Button>
        </Panel.Actions>
      </Panel.Header>
      {body()}
    </Panel>
  );
}
