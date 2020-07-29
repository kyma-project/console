import React from 'react';
import PropTypes from 'prop-types';

import { FormItem, FormLabel, FormInput, Panel } from 'fundamental-react';
import { StringInput } from 'react-shared';
import CheckboxFormControl from './CheckboxFormControl';
import './OAuthClientForm.scss';
import { grantTypes, responseTypes } from '../common';

function validateSpec({ grantTypes, responseTypes, scope, secretName }) {
  return (
    grantTypes.length >= 1 &&
    responseTypes.length >= 1 &&
    !!scope &&
    !!secretName
  );
}

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
    <Panel className="fd-has-margin-m fd-has-padding-bottom-s oauth-client-panel">
      <Panel.Header>
        <Panel.Head title="Configuration" />
      </Panel.Header>
      <FormItem>
        <CheckboxFormControl
          name="Response types"
          availableValues={responseTypes}
          values={spec.responseTypes}
          onChange={values => updateSpec({ ...spec, responseTypes: values })}
        />
      </FormItem>
      <FormItem>
        <CheckboxFormControl
          name="Grant types"
          availableValues={grantTypes}
          values={spec.grantTypes}
          onChange={values => updateSpec({ ...spec, grantTypes: values })}
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
          value={spec.secretName}
        />
      </FormItem>
    </Panel>
  );
}
