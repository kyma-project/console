import React from 'react';
import PropTypes from 'prop-types';
import copyToCliboard from 'copy-to-clipboard';
import { Tooltip } from 'react-shared';

import {
  Button,
  FormSet,
  FormItem,
  FormLabel,
  FormMessage,
  FormTextarea,
} from 'fundamental-react';
import './ConnectApplication.scss';

import { useMutation } from '@apollo/react-hooks';
import { CONNECT_APPLICATION } from 'components/Application/gql';

ConnectApplicationModal.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

const FormEntry = ({ caption, name, value }) => (
  <FormItem>
    <FormLabel htmlFor={name}>{caption}</FormLabel>
    <div className="connect-application__input--copyable">
      <FormTextarea id={name} value={value || 'Loading...'} readOnly />
      {value && (
        <Tooltip content="Copy to clipboard" position="top">
          <Button
            option="light"
            glyph="copy"
            onClick={() => copyToCliboard(value)}
          />
        </Tooltip>
      )}
    </div>
  </FormItem>
);

export default function ConnectApplicationModal({ applicationId }) {
  const [connectApplicationMutation] = useMutation(CONNECT_APPLICATION);
  const [error, setError] = React.useState('');
  const [connectionData, setConnectionData] = React.useState({});

  React.useEffect(() => {
    async function connectApplication(id) {
      try {
        const { data } = await connectApplicationMutation({
          variables: { id },
        });
        setConnectionData(data.requestOneTimeTokenForApplication);
      } catch (e) {
        console.warn(e);
        setError(e.message || 'Error!');
      }
    }
    connectApplication(applicationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = error ? (
    <FormMessage type="error">{error}</FormMessage>
  ) : (
    <FormSet>
      <FormEntry
        caption="Data to connect Application (base64 encoded)"
        name="raw-encoded"
        value={connectionData.rawEncoded}
      />
      <FormEntry
        caption="Legacy connector URL"
        name="legacy-connector-url"
        value={connectionData.legacyConnectorURL}
      />
    </FormSet>
  );

  return <section className="connect-application__content">{content}</section>;
}
