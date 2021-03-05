import React from 'react';

import { useGetList, usePost, StringInput, K8sNameInput } from 'react-shared';

import { FormItem, FormLabel } from 'fundamental-react';
import CheckboxFormControl from './CheckboxFormControl';
import { grantTypes, responseTypes, emptySpec, validateSpec } from './helpers';
import { createOAuthClient } from './createOAuthClient';

export const OAuth2ClientsCreate = ({
  namespace,
  formElementRef,
  onChange,
  onCompleted,
  onError,
  resourceUrl,
  refetchList,
  setCustomValid,
}) => {
  const postRequest = usePost();
  const [spec, setSpec] = React.useState(emptySpec);
  const [useCustomSecret, setUseCustomSecret] = React.useState(false);

  const { data } = useGetList()(`/api/v1/namespaces/${namespace}/secrets/`, {
    pollingInterval: 3000,
  });
  const secretNames = data?.map(s => s.metadata.name) || [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setCustomValid(validateSpec(spec)), [
    spec,
    useCustomSecret,
  ]);

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!useCustomSecret) {
      spec.secretName = spec.name;
    }
    const input = createOAuthClient(namespace, spec);
    try {
      await postRequest(resourceUrl, input);
      refetchList();
      onCompleted(spec.name, `Client created`);
    } catch (e) {
      console.warn(e);
      onError(`The client could not be created:`, e.message);
    }
  }

  return (
    <form ref={formElementRef} onChange={onChange} onSubmit={handleFormSubmit}>
      <FormItem>
        <K8sNameInput
          value={spec.name}
          label="Name"
          kind="Client"
          onChange={e => setSpec({ ...spec, name: e.target.value })}
        />
      </FormItem>
      <FormItem className="clearfix">
        <CheckboxFormControl
          name="Response types"
          availableValues={responseTypes}
          values={spec.responseTypes}
          onChange={values => setSpec({ ...spec, responseTypes: values })}
        />
      </FormItem>
      <FormItem className="clearfix">
        <CheckboxFormControl
          name="Grant types"
          availableValues={grantTypes}
          values={spec.grantTypes}
          onChange={values => setSpec({ ...spec, grantTypes: values })}
        />
      </FormItem>
      <FormItem>
        <FormLabel htmlFor="scope" required className="fd-has-display-block">
          Scopes
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
            {secretNames?.includes(spec.secretName) &&
              `Secret "${spec.secretName}" exists and will be used for this client.`}
          </p>
        </>
      )}
    </form>
  );
};
