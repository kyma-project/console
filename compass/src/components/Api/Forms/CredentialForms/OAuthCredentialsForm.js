import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';
import TextFormItem from './../../../Shared/TextFormItem';

export const CREDENTIAL_TYPE_OAUTH = 'OAuth';

export const oAuthRefPropTypes = PropTypes.shape({
  clientId: CustomPropTypes.ref,
  clientSecret: CustomPropTypes.ref,
  url: CustomPropTypes.ref,
});

OAuthCredentialsForm.propTypes = {
  refs: oAuthRefPropTypes,
  defaultValues: PropTypes.object,
};

export default function OAuthCredentialsForm({ refs, defaultValues }) {
  return (
    <section className="fd-has-margin-top-medium">
      <TextFormItem
        inputKey="client-id"
        required
        type="password"
        label="Client ID"
        inputRef={refs.clientId}
        defaultValue={defaultValues && defaultValues.clientId}
      />
      <TextFormItem
        inputKey="client-secret"
        required
        type="password"
        label="Client Secret"
        inputRef={refs.clientSecret}
        defaultValue={defaultValues && defaultValues.clientSecret}
      />
      <TextFormItem
        inputKey="url"
        required
        type="url"
        label="Url"
        inputRef={refs.url}
        defaultValue={defaultValues && defaultValues.url}
      />
    </section>
  );
}
