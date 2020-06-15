import React from 'react';
import PropTypes from 'prop-types';
import {
  LayoutGrid,
  FormInput,
  FormItem,
  FormLabel,
  Button,
} from 'fundamental-react';
import './JwtDetails.scss';
import { getApiUrl as getURL } from '@kyma-project/common';

JwtDetails.propTypes = {
  config: PropTypes.object.isRequired,
  setConfig: PropTypes.func.isRequired,
  handleFormChanged: PropTypes.func.isRequired,
};

export default function JwtDetails({ config, setConfig, handleFormChanged }) {
  const defaultIDPPreset = {
    jwksUri: getURL('defaultIdpJwksUri'),
    issuer: getURL('defaultIdpIssuer'),
  };

  const emptyIDPPreset = {
    jwksUri: '',
    issuer: '',
  };

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
    config.jwks_urls = [defaultIDPPreset.jwksUri]; //[];
  }
  if (!config.trusted_issuers) {
    config.trusted_issuers = [defaultIDPPreset.issuer]; //[];
  }
  const { jwks_urls, trusted_issuers } = config;

  const addPresetButton = (
    <div className="preset-row">
      <Button
        onClick={() => addPreset(emptyIDPPreset)}
        className="add-preset"
        glyph="add"
        typeAttr="button"
      >
        Add
      </Button>
    </div>
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
            <FormInput
              onChange={e => updateJwksUriAt(idx, e.target.value)}
              value={jwks_urls ? jwks_urls[idx] : ''}
              id={`jwt-jwks-uri-${idx}`}
              key={`jwt-jwks-uri-${idx}`}
              placeholder="JWKS Uri"
              type="url"
              required
              aria-label={`jwt-jwks-uri-${idx}`}
              title="JWKS Uri"
            />
          </FormItem>
        </LayoutGrid>
      </div>
      <FormItem>
        <FormLabel htmlFor={`remove-preset-${idx}`} />
        <Button
          glyph="delete"
          type="negative"
          typeAttr="button"
          className="fd-has-margin-left-s"
          aria-label={`remove-preset-${idx}`}
          id={`remove-preset-${idx}`}
          onClick={() => removePreset(idx)}
        />
      </FormItem>
    </div>
  ));

  return (
    <section className="jwt-details">
      {idpList}
      {addPresetButton}
    </section>
  );
}
