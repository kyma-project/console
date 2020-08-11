import React from 'react';
import PropTypes from 'prop-types';

import { FormItem, FormLabel, Panel } from 'fundamental-react';
import { StringInput, K8sNameInput, isK8SNameValid } from 'react-shared';
import CheckboxFormControl from './CheckboxFormControl';
import './OAuthClientForm.scss';
import { grantTypes, responseTypes } from '../common';

import { useQuery } from 'react-apollo';
import { GET_SECRETS } from 'gql/queries';

function validateSpec(spec, validateSecret) {
  const { grantTypes, responseTypes, scope, secretName } = spec;
  return (
    grantTypes.length >= 1 &&
    responseTypes.length >= 1 &&
    !!scope &&
    (!validateSecret || isK8SNameValid(secretName))
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
  showCustomSecret: PropTypes.bool,
  isInCreateMode: PropTypes.bool,
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string,
};

export default function OAuthClientForm({
  spec: originalSpec,
  onChange,
  showCustomSecret,
  isInCreateMode = false,
  namespace,
  name: originalName = '',
}) {
  const [name, setName] = React.useState(originalName);
  const [spec, setSpec] = React.useState(originalSpec);
  const [useCustomSecret, setUseCustomSecret] = React.useState(
    showCustomSecret,
  );

  const { data } = useQuery(GET_SECRETS, { variables: { namespace } });
  const secrets = data?.secrets?.map(s => s.name) || [];

  const revalidate = () => {
    const isNameValid = !isInCreateMode || isK8SNameValid(name);
    const isSpecValid = validateSpec(spec, useCustomSecret);

    onChange(
      useCustomSecret ? spec : { ...spec, secretName: name },
      isNameValid && isSpecValid,
      name,
    );
  };

  React.useEffect(revalidate, [spec, name, useCustomSecret]);

  return (
    <Panel className="fd-has-margin-m fd-has-padding-bottom-s oauth-client-panel">
      <Panel.Header>
        <Panel.Head title="Configuration" />
      </Panel.Header>
      {isInCreateMode && (
        <FormItem>
          <K8sNameInput
            label="Name"
            kind="Client"
            onChange={e => setName(e.target.value)}
          />
        </FormItem>
      )}
      <FormItem>
        <CheckboxFormControl
          name="Response types"
          availableValues={responseTypes}
          values={spec.responseTypes}
          onChange={values => setSpec({ ...spec, responseTypes: values })}
        />
      </FormItem>
      <FormItem>
        <CheckboxFormControl
          name="Grant types"
          availableValues={grantTypes}
          values={spec.grantTypes}
          onChange={values => setSpec({ ...spec, grantTypes: values })}
        />
      </FormItem>
      <FormItem>
        <FormLabel htmlFor="scope" required>
          Scope
        </FormLabel>
        <StringInput
          stringList={spec.scope.split(' ').filter(scope => scope)}
          onChange={scope => setSpec({ ...spec, scope: scope.join(' ') })}
          id="scope"
        />
      </FormItem>
      <p
        className="link fd-has-display-block fd-has-margin-top-small"
        onClick={() => setUseCustomSecret(!useCustomSecret)}
      >
        {useCustomSecret
          ? 'Create secret with the same name as client.'
          : 'Define custom secret name for this client.'}
      </p>
      {useCustomSecret && (
        <>
          <FormItem>
            <K8sNameInput
              label="Secret name"
              kind="Secret"
              onChange={e => setSpec({ ...spec, secretName: e.target.value })}
              value={spec.secretName}
            />
          </FormItem>
          <p className="fd-has-display-block fd-has-color-text-3">
            {secrets?.includes(spec.secretName) &&
              `Secret "${spec.secretName}" exists and will be used for this client.`}
          </p>
        </>
      )}
    </Panel>
  );
}
