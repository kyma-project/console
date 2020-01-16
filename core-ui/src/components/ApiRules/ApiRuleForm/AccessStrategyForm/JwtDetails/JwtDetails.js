import React from 'react';
import {
  LayoutGrid,
  FormInput,
  FormItem,
  FormLabel,
  Dropdown,
  Menu,
  Button,
  Popover,
  FormSelect,
} from 'fundamental-react';
import './JwtDetails.scss';

export function JwtDetails({ config, setConfig, idpPresets }) {
  const jwks_urls = config.jwks_urls || [];
  const trusted_issuers = config.trusted_issuers || [];

  return (
    <section className="jwt-details">
      <Dropdown>
        <Popover
          body={
            <Menu>
              <Menu.List>
                <Menu.Item
                  onClick={() =>
                    setConfig({
                      jwks_urls: [...jwks_urls, ''],
                      trusted_issuers: [...trusted_issuers, ''],
                    })
                  }
                >
                  Custom
                </Menu.Item>
                {idpPresets.map(preset => (
                  <Menu.Item
                    key={preset.name}
                    onClick={() =>
                      setConfig({
                        jwks_urls: [...jwks_urls, preset.jwksUri],
                        trusted_issuers: [...trusted_issuers, preset.issuer],
                      })
                    }
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
    </section>
  );

  return (
    <>
      <FormItem>
        <FormSelect
          value="Add preset"
          onChange={e => {
            const preset = idpPresets.find(p => p.name === e.target.value);
            setConfig({
              jwks_urls: [
                ...(config.jwks_urls || []),
                preset ? preset.jwksUri : '',
              ],
              trusted_issuers: [
                ...(config.trusted_issuers || []),
                preset ? preset.issuer : '',
              ],
            });

            console.log({
              jwks_urls: [
                ...(config.jwks_urls || []),
                preset ? preset.jwksUri : '',
              ],
              trusted_issuers: [
                ...(config.trusted_issuers || []),
                preset ? preset.issuer : '',
              ],
            });
          }}
        >
          <option value={null}>Custom</option>
          {idpPresets.map(preset => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </FormSelect>
      </FormItem>
    </>
  );
}

/*
const inputDisabled = !!preset;
  return (
    <section className="jwt-details">
      <FormItem>
        <FormSelect
          defaultValue={''}
          aria-label="IDP preset"
          onChange={e => {
            const choosenPreset = idpPresets.find(
              p => p.name === e.target.value,
            );
            setPreset(choosenPreset);
            if (choosenPreset) {
              setConfig({
                jwks_urls: [choosenPreset.jwksUri],
                trusted_issuers: [choosenPreset.issuer],
              });
            } else {
              setConfig({
                jwks_urls: [],
                trusted_issuers: [],
              });
            }
          }}
        >
          <option value={null}>Custom</option>
          {idpPresets.map(preset => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </FormSelect>
      </FormItem>
      <LayoutGrid cols={2}>
        <FormItem>
          <FormLabel htmlFor="jwt-issuer" required>
            Issuer
          </FormLabel>
          <FormInput
            onChange={e =>
              setConfig({ ...config, trusted_issuers: [e.target.value] })
            }
            value={config.trusted_issuers ? config.trusted_issuers[0] : ''}
            id="jwt-issuer"
            disabled={inputDisabled}
            placeholder="Issuer"
            type="text"
            required
            aria-label="jwt-issuer"
            title="Issuer"
          />
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="jwt-jwks-uri" required>
            JWKS Uri
          </FormLabel>
          <FormInput
            onChange={e =>
              setConfig({ ...config, jwks_urls: [e.target.value] })
            }
            value={config.jwks_urls ? config.jwks_urls[0] : ''}
            id="jwt-jwks-uri"
            disabled={inputDisabled}
            placeholder="JWKS Uri"
            type="text"
            required
            aria-label="jwt-jwks-uri"
            title="JWKS Uri"
          />
        </FormItem>
      </LayoutGrid>
    </section> */
