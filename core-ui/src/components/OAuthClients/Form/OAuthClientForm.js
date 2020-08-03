import React from 'react';
import PropTypes from 'prop-types';

import { FormItem, FormLabel, Panel } from 'fundamental-react';
import { StringInput, K8sNameInput, isK8SNameValid } from 'react-shared';
import CheckboxFormControl from './CheckboxFormControl';
import './OAuthClientForm.scss';
import { grantTypes, responseTypes } from '../common';

import { useQuery } from 'react-apollo';
import { GET_SECRETS } from 'gql/queries';

function validateSpec({ grantTypes, responseTypes, scope, secretName }) {
  return (
    grantTypes.length >= 1 &&
    responseTypes.length >= 1 &&
    !!scope &&
    (!secretName || isK8SNameValid(secretName))
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
  isCreate: PropTypes.bool,
  namespace: PropTypes.string.isRequired,
};

export default function OAuthClientForm({
  spec,
  onChange,
  namespace,
  isCreate = false,
}) {
  const [name, setName] = React.useState('');

  const { data } = useQuery(GET_SECRETS, { variables: { namespace } });
  const secrets = data?.secrets?.map(s => s.name) || [];

  const isNameValid = name => !isCreate || isK8SNameValid(name);

  const updateSpec = spec => {
    const isValid = validateSpec(spec) && isNameValid(name);
    onChange(spec, isValid, name);
  };

  const updateName = name => {
    setName(name);
    const isValid = validateSpec(spec) && isNameValid(name);
    onChange(spec, isValid, name);
  };

  const secretMessage = () => {
    if (!spec.secretName) {
      return 'Secret name will be the same as client name.';
    }
    if (secrets.includes(spec.secretName)) {
      return `Secret ${spec.secretName} will be used for this client.`;
    } else {
      return `Secret ${spec.secretName} will be created and used for this client.`;
    }
  };

  return (
    <Panel className="fd-has-margin-m fd-has-padding-bottom-s oauth-client-panel">
      <Panel.Header>
        <Panel.Head title="Configuration" />
      </Panel.Header>
      {isCreate && (
        <FormItem>
          <K8sNameInput
            label="Name"
            kind="Client"
            onChange={e => updateName(e.target.value)}
          />
        </FormItem>
      )}
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
        <K8sNameInput
          label="Secret name"
          kind="Secret"
          onChange={e => updateSpec({ ...spec, secretName: e.target.value })}
          value={spec.secretName}
          required={false}
        />
      </FormItem>
      <Panel.Footer style={{ display: 'block' }}>
        {secretMessage()}
      </Panel.Footer>
    </Panel>
  );
}
