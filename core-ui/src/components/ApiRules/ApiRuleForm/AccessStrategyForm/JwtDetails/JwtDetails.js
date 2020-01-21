import React, { useState } from 'react';
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
import './JwtDetails.scss';

export function JwtDetails({ config, setConfig, idpPresets }) {
  function getInitialPresetTypes() {
    if (
      !idpPresets ||
      !idpPresets.length ||
      !config ||
      !config.jwks_urls ||
      !config.jwks_urls.length
    )
      return [];
    return (
      config.jwks_urls.map(jwks_url =>
        idpPresets.find(p => p.jwksUri === jwks_url) ? 'preset' : 'custom',
      ) || []
    );
  }

  function removePreset(index) {
    setPresetTypes([
      ...presetTypes.slice(0, index),
      ...presetTypes.slice(index + 1, presetTypes.length),
    ]);
    setConfig({
      jwks_urls: [
        ...jwks_urls.slice(0, index),
        ...jwks_urls.slice(index + 1, jwks_urls.length),
      ],
      trusted_issuers: [
        ...trusted_issuers.slice(0, index),
        ...trusted_issuers.slice(index + 1, trusted_issuers.length),
      ],
    });
  }

  const jwks_urls = config.jwks_urls || [];
  const trusted_issuers = config.trusted_issuers || [];
  const [presetTypes, setPresetTypes] = useState(getInitialPresetTypes());

  return (
    <section className="jwt-details">
      <Dropdown>
        <Popover
          body={
            <Menu>
              <Menu.List>
                <Menu.Item
                  onClick={() => {
                    setPresetTypes([...presetTypes, 'custom']);
                    setConfig({
                      jwks_urls: [...jwks_urls, ''],
                      trusted_issuers: [...trusted_issuers, ''],
                    });
                  }}
                >
                  Custom
                </Menu.Item>
                {idpPresets.map(preset => (
                  <Menu.Item
                    key={preset.name}
                    onClick={() => {
                      setPresetTypes([...presetTypes, 'preset']);
                      setConfig({
                        jwks_urls: [...jwks_urls, preset.jwksUri],
                        trusted_issuers: [...trusted_issuers, preset.issuer],
                      });
                    }}
                  >
                    {preset.name}
                  </Menu.Item>
                ))}
              </Menu.List>
            </Menu>
          }
          control={
            <Button className="fd-dropdown__control" typeAttr="button">
              Add preset...
            </Button>
          }
        />
      </Dropdown>
      {jwks_urls &&
        trusted_issuers &&
        presetTypes &&
        jwks_urls.map((_, idx) => (
          <div className="preset-row" key={`preset-row-${idx}`}>
            <div className="preset-content">
              <LayoutGrid cols="2">
                <FormItem>
                  <FormLabel htmlFor={`jwt-issuer-${idx}`} required>
                    Issuer
                  </FormLabel>
                  <FormInput
                    onChange={e =>
                      setConfig({
                        jwks_urls: [...jwks_urls],
                        trusted_issuers: [
                          ...trusted_issuers.slice(0, idx),
                          e.target.value,
                          ...trusted_issuers.slice(
                            idx + 1,
                            trusted_issuers.length,
                          ),
                        ],
                      })
                    }
                    value={trusted_issuers ? trusted_issuers[idx] : ''}
                    id={`jwt-issuer-${idx}`}
                    key={`jwt-issuer-${idx}`}
                    disabled={presetTypes[idx] !== 'custom'}
                    placeholder="Issuer"
                    type="text"
                    required
                    aria-label="jwt-issuer"
                    title="Issuer"
                    pattern="^\/.*.{1,}"
                  />
                </FormItem>
                <FormItem>
                  <FormLabel htmlFor={`jwt-jwks-uri-${idx}`} required>
                    JWKS Uri
                  </FormLabel>
                  <FormInput
                    onChange={e =>
                      setConfig({
                        jwks_urls: [
                          ...jwks_urls.slice(0, idx),
                          e.target.value,
                          ...jwks_urls.slice(idx + 1, jwks_urls.length),
                        ],
                        trusted_issuers: [...trusted_issuers],
                      })
                    }
                    value={jwks_urls ? jwks_urls[idx] : ''}
                    id={`jwt-jwks-uri-${idx}`}
                    key={`jwt-jwks-uri-${idx}`}
                    disabled={presetTypes[idx] !== 'custom'}
                    placeholder="JWKS Uri"
                    type="text"
                    required
                    aria-label="jwt-jwks-uri"
                    title="JWKS Uri"
                    pattern="^\/.*.{1,}"
                  />
                </FormItem>
              </LayoutGrid>
            </div>
            <FormItem>
              <FormLabel htmlFor="jwt-delete" />

              <Button
                glyph="delete"
                type="negative"
                typeAttr="button"
                className="remove-access-strategy fd-has-margin-left-m"
                aria-label="remove-access-strategy"
                onClick={() => removePreset(idx)}
              />
            </FormItem>
          </div>
        ))}
    </section>
  );
}
