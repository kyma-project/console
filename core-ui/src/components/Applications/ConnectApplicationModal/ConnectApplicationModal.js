import React from 'react';
import PropTypes from 'prop-types';
import { Modal, CopiableText } from 'react-shared';
import {
  Button,
  FormSet,
  FormItem,
  FormLabel,
  FormInput,
  FormMessage,
} from 'fundamental-react';
import './ConnectApplicationModal.scss';
import { CompassGqlContext } from 'index';

import { useMutation } from '@apollo/react-hooks';
import { CONNECT_APPLICATION } from 'gql/mutations';

ConnectApplicationModal.propTypes = {
  applicationId: PropTypes.string.isRequired,
};

const FormEntry = ({ caption, name, value }) => (
  <FormItem className="connect-application__data-entry">
    <FormLabel htmlFor={name}>{caption}</FormLabel>
    <CopiableText
      textToCopy={value}
      caption={
        <FormInput
          type="text"
          id={name}
          value={value || 'Loading...'}
          readOnly
        />
      }
    />
  </FormItem>
);

export default function ConnectApplicationModal({ applicationId }) {
  const compassGqlClient = React.useContext(CompassGqlContext);
  const [connectApplicationMutation] = useMutation(CONNECT_APPLICATION, {
    client: compassGqlClient,
  });

  const [error, setError] = React.useState('');
  const [connectionData, setConnectionData] = React.useState({});

  const connectApplication = async id => {
    try {
      const { data } = await connectApplicationMutation({ variables: { id } });
      setConnectionData(data.requestOneTimeTokenForApplication);
    } catch (e) {
      console.warn(e);
      setError(e.message || 'Error!');
    }
  };

  const clearConnectionData = () => setConnectionData({}); // reset token

  const modalContent = error ? (
    <FormMessage type="error">{error}</FormMessage>
  ) : (
    <FormSet>
      <FormEntry caption="Token" name="token" value={connectionData.token} />
      <FormEntry
        caption="Connector URL"
        name="connector-url"
        value={connectionData.connectorURL}
      />
    </FormSet>
  );

  return (
    <>
      <Modal
        modalOpeningComponent={
          <Button
            option="emphasized"
            onClick={() => connectApplication(applicationId)}
          >
            Connect
          </Button>
        }
        title="Connect Application"
        confirmText="Close"
        onHide={clearConnectionData}
      >
        <section className="connect-application__content">
          {modalContent}
        </section>
      </Modal>
    </>
  );
}
