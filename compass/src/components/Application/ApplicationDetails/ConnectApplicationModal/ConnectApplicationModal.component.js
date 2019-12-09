import React from 'react';
import PropTypes from 'prop-types';
import copyToCliboard from 'copy-to-clipboard';
import { Tooltip } from 'react-shared';

import {
  Button,
  FormSet,
  FormItem,
  FormLabel,
  FormInput,
  FormMessage,
} from 'fundamental-react';
import './ConnectApplicationModal.scss';
import { Modal } from 'shared/components/Modal/Modal';

ConnectApplicationModal.propTypes = {
  applicationId: PropTypes.string.isRequired,
  connectApplicationMutation: PropTypes.func.isRequired,
};

const FormEntry = ({ caption, name, value }) => (
  <FormItem>
    <FormLabel htmlFor={name}>{caption}</FormLabel>
    <div className="connect-application__input--copyable">
      <FormInput type="text" id={name} value={value || 'Loading...'} readOnly />
      {value && (
        <Tooltip title="Copy to clipboard" position="top">
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

export default function ConnectApplicationModal({
  applicationId,
  connectApplicationMutation,
}) {
  const [error, setError] = React.useState('');
  const [connectionData, setConnectionData] = React.useState({});

  const connectApplication = async id => {
    try {
      const { data } = await connectApplicationMutation(id);
      setConnectionData(data.generateOneTimeTokenForApplication);
    } catch (e) {
      console.warn(e);
      setError(e.message || 'Error!');
    }
  };

  const clearConnectionData = () => {
    setConnectionData({}); // reset token
  };

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
            data-test-id="open-modal"
          >
            Connect Application
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
