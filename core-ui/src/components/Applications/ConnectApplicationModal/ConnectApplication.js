import React from 'react';
import PropTypes from 'prop-types';
import { CopiableText } from 'react-shared';
import {
  FormSet,
  FormItem,
  FormLabel,
  FormTextarea,
  FormMessage,
} from 'fundamental-react';
import './ConnectApplication.scss';
import { CompassGqlContext } from 'index';

import { useMutation } from '@apollo/react-hooks';
import { CONNECT_APPLICATION } from 'gql/mutations';
const FormEntry = ({ caption, name, value }) => (
  <FormItem className="connect-application__data-entry">
    <FormLabel htmlFor={name}>{caption}</FormLabel>
    <CopiableText textToCopy={value || ''}>
      <FormTextarea
        type="text"
        id={name}
        value={value || 'Loading...'}
        readOnly
      />
    </CopiableText>
  </FormItem>
);

ConnectApplication.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

export default function ConnectApplication({ applicationId }) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const [connectApplicationMutation] = useMutation(CONNECT_APPLICATION, {
    client: compassGqlClient,
  });

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
