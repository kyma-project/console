import React from 'react';
import PropTypes from 'prop-types';
import {
  LayoutGrid,
  FormInput,
  FormItem,
  FormLabel,
  Dropdown,
  Menu,
  Button,
  Popover,
} from 'fundamental-react';
import { InputWithPrefix } from 'react-shared';
import './JwtDetails.scss';

JwtDetails.propTypes = {
  config: PropTypes.object.isRequired,
  setConfig: PropTypes.func.isRequired,
  idpPresets: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  handleFormChanged: PropTypes.func.isRequired,
};

export default function JwtDetails({
  config,
  setConfig,
  idpPresets,
  handleFormChanged,
}) {
  function addPreset(preset) {
    config.jwks_urls.push(preset ? preset.jwksUri : '');
    config.trusted_issuers.push(preset ? preset.issuer : '');
    setConfig({ ...config });
    handleFormChanged();
  }

  function removePreset(index) {
    config.jwks_urls.splice(index, 1);
    config.trusted_issuers.splice(index, 1);
    setConfig({ ...config });
    handleFormChanged();
  }

  function updateIssuerAt(index, issuer) {
    config.trusted_issuers[index] = issuer;
    setConfig({ ...config });
  }

  function updateJwksUriAt(index, jwksUri) {
    config.jwks_urls[index] = jwksUri;
    setConfig({ ...config });
  }

  if (!config.jwks_urls) {
    config.jwks_urls = [];
  }
  if (!config.trusted_issuers) {
    config.trusted_issuers = [];
  }
  const { jwks_urls, trusted_issuers } = config;

  const configureIdpDropdown = (
    <Dropdown>
      <Popover
        body={
          <Menu>
            <Menu.List>
              <Menu.Item onClick={() => addPreset(null)}>Custom</Menu.Item>
              {idpPresets.map(preset => (
                <Menu.Item key={preset.name} onClick={() => addPreset(preset)}>
                  {preset.name}
                </Menu.Item>
              ))}
            </Menu.List>
          </Menu>
        }
        control={
          <Button className="fd-dropdown__control" typeAttr="button">
            Configure identity provider...
          </Button>
        }
      />
    </Dropdown>
  );

  const idpList = jwks_urls.map((_, idx) => (
    <div className="preset-row" key={`preset-row-${idx}`}>
      <div className="preset-content">
        <LayoutGrid cols="2">
          <FormItem>
            <FormLabel htmlFor={`jwt-issuer-${idx}`} required>
              Issuer
            </FormLabel>
            <FormInput
              onChange={e => updateIssuerAt(idx, e.target.value)}
              value={trusted_issuers ? trusted_issuers[idx] : ''}
              id={`jwt-issuer-${idx}`}
              key={`jwt-issuer-${idx}`}
              placeholder="Issuer"
              type="url"
              required
              aria-label={`jwt-issuer-${idx}`}
              title="Issuer"
            />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor={`jwt-jwks-uri-${idx}`} required>
              JWKS Uri
            </FormLabel>
            <InputWithPrefix
              prefix="https://"
              replacePrefix={true}
              onChange={e => updateJwksUriAt(idx, e.target.value)}
              value={jwks_urls ? jwks_urls[idx] : ''}
              id={`jwt-jwks-uri-${idx}`}
              key={`jwt-jwks-uri-${idx}`}
              placeholder="JWKS Uri"
              type="text"
              required
              aria-label={`jwt-jwks-uri-${idx}`}
              title="JWKS Uri"
            />
          </FormItem>
        </LayoutGrid>
      </div>
      <FormItem>
        <FormLabel htmlFor={`remove-access-strategy-${idx}`} />
        <Button
          glyph="delete"
          type="negative"
          typeAttr="button"
          className="remove-access-strategy fd-has-margin-left-m"
          aria-label={`remove-access-strategy-${idx}`}
          id={`remove-access-strategy-${idx}`}
          onClick={() => removePreset(idx)}
        />
      </FormItem>
    </div>
  ));

  return (
    <section className="jwt-details">
      {configureIdpDropdown}
      {idpList}
    </section>
  );
}
