import React from 'react';
import PropTypes from 'prop-types';

import {
  FormItem,
  FormLabel,
  FormInput,
  Panel,
  FormRadioGroup,
  Checkbox,
} from 'fundamental-react';
import { StringInput } from 'react-shared';
import './OAuthClientForm.scss';

function validateSpec({ grantTypes, responseTypes, scope, secretName }) {
  return (
    grantTypes.length >= 1 &&
    responseTypes.length >= 1 &&
    !!scope &&
    !!secretName
  );
}

const grantTypes = {
  client_credentials: 'Client credentials',
  authorization_code: 'Authorization code',
  implicit: 'Implicit',
  refresh_token: 'Refresh token',
};

const responseTypes = {
  id_token: 'ID token',
  code: 'Code',
  token: 'Token',
};

const Potem = ({ availableValues, values, name, setSpec }) => {
  const onChange = (value, checked) => {
    if (checked) {
      values = [...values, value];
    } else {
      values = values.filter(v => v !== value);
    }
    setSpec(values);
  };

  return (
    <>
      <FormLabel htmlFor={name} required>
        {name}
      </FormLabel>
      <FormRadioGroup inline className="inline-radio-group">
        {Object.entries(availableValues).map(([value, displayName]) => (
          <Checkbox
            key={value}
            value={displayName}
            defaultChecked={values.includes(value)}
            onChange={e => onChange(value, e.target.checked)}
          />
        ))}
      </FormRadioGroup>
    </>
  );
};

OAuthClientForm.propTypes = {
  spec: PropTypes.shape({
    grantTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    responseTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    scope: PropTypes.string.isRequired,
    secretName: PropTypes.string.isRequired,
  }),
  onChange: PropTypes.func.isRequired,
};

export default function OAuthClientForm({ spec, onChange }) {
  const updateSpec = spec => {
    const isValid = validateSpec(spec);
    onChange(spec, isValid);
  };

  return (
    <Panel className="fd-has-margin-m fd-has-padding-m oauth-client-form">
      <FormItem>
        <Potem
          name="Response types"
          availableValues={responseTypes}
          values={spec.responseTypes}
          setSpec={values => updateSpec({ ...spec, responseTypes: values })}
        />
      </FormItem>
      <FormItem>
        <Potem
          name="Grant types"
          availableValues={grantTypes}
          values={spec.grantTypes}
          setSpec={values => updateSpec({ ...spec, grantTypes: values })}
        />
      </FormItem>
      <FormItem>
        <FormLabel htmlFor="scope" required>
          Scope
        </FormLabel>
        <StringInput
          stringList={spec.scope.split(' ').filter(scope => scope)}
          onChange={scope => updateSpec({ ...spec, scope: scope.join(' ') })}
          id="scope"
        />
      </FormItem>

      <FormItem>
        <FormLabel htmlFor="secret-name" required>
          Secret name
        </FormLabel>
        <FormInput
          required
          id="secret-name"
          placeholder="Secret name"
          onChange={e => updateSpec({ ...spec, secretName: e.target.value })}
        />
      </FormItem>
    </Panel>
  );
}
