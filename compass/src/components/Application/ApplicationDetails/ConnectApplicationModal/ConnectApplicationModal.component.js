import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';
import copyToCliboard from 'copy-to-clipboard';

import {
  Button,
  FormSet,
  FormItem,
  FormLabel,
  FormInput,
  FormMessage,
  Modal,
} from 'fundamental-react';
import './ConnectApplicationModal.scss';

ConnectApplicationModal.propTypes = {
  applicationId: PropTypes.string.isRequired,
  connectApplicationMutation: PropTypes.func.isRequired,
};

const FormEntry = ({ caption, name, value }) => (
  <FormItem>
    <FormLabel htmlFor={name}>{caption}</FormLabel>
    <div className="form-entry--copyable">
      <FormInput type="text" id={name} value={value || 'Loading...'} readOnly />
      {value && <Button glyph="copy" onClick={() => copyToCliboard(value)} />}
    </div>
  </FormItem>
);

export default function ConnectApplicationModal({
  applicationId,
  connectApplicationMutation,
}) {
  const [isOpen, setOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState(
    'Connecting Application...',
  );
  const [error, setError] = React.useState('');
  const [connectionData, setConnectionData] = React.useState({});

  const connectApplication = async id => {
    try {
      const { data } = await connectApplicationMutation(id);
      setConnectionData(data.generateOneTimeTokenForApplication);
      setModalTitle('Application connected succesfully');
    } catch (e) {
      console.warn(e);
      setModalTitle('Error');
      setError(e.message || 'Error!');
    }
  };

  const openModal = () => {
    setOpen(true);
    LuigiClient.uxManager().addBackdrop();

    const isConnected = !Object.keys(connectionData).length;
    if (isConnected) {
      connectApplication(applicationId);
    }
  };

  const closeModal = () => {
    setOpen(false);
    LuigiClient.uxManager().removeBackdrop();
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
      <Button option="emphasized" onClick={openModal} data-test-id="open-modal">
        Connect Application
      </Button>
      <Modal
        show={isOpen}
        title={modalTitle}
        onClose={closeModal}
        actions={
          <Button option="emphasized" onClick={closeModal}>
            Close
          </Button>
        }
      >
        {modalContent}
      </Modal>
    </>
  );
}
