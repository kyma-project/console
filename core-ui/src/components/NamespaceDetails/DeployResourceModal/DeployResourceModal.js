import React from 'react';
import PropTypes from 'prop-types';

import {
  FileInput,
  Modal,
  useMicrofrontendContext,
  useConfig,
} from 'react-shared';
import { Button } from 'fundamental-react';
import { useNotification } from 'react-shared';
import { parseFile, getResourceUrl } from './deployResourceHelpers';

DeployResourceModal.propTypes = { name: PropTypes.string.isRequired };

export default function DeployResourceModal({ name }) {
  const { idToken } = useMicrofrontendContext();
  const { fromConfig } = useConfig();
  const notification = useNotification();
  const [error, setError] = React.useState(null);
  const [content, setContent] = React.useState(null);

  const fileInputChanged = async file => {
    const [content, error] = await parseFile(file);
    setContent(content);
    setError(error);
  };

  const deployResource = async () => {
    const url = getResourceUrl(
      fromConfig('domain'),
      content.kind,
      content.apiVersion,
      name,
    );
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(content),
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        notification.notifySuccess({
          content: 'Successfully deployed new resource',
        });
      } else {
        const { message } = await response.json();
        notification.notifyError({
          content: `Cannot create a k8s resource: ${message}.`,
        });
      }
    } catch (e) {
      console.warn(e);
      notification.notifyError({
        content: `Cannot create a k8s resource due: ${e.message}.`,
      });
    }
  };

  const modalOpeningComponent = (
    <Button glyph="add">Deploy new resource</Button>
  );

  return (
    <Modal
      title="Deploy new resource"
      modalOpeningComponent={modalOpeningComponent}
      confirmText="Deploy"
      cancelText="Cancel"
      onConfirm={deployResource}
      disabledConfirm={!content || !!error}
      onShow={() => setContent(null) || setError(null)}
    >
      <form>
        <FileInput
          fileInputChanged={fileInputChanged}
          availableFormatsMessage="Select YAML or JSON file"
          acceptedFileFormats=".yml,.yaml,.json"
          required
        />
        {error && (
          <p
            className="fd-has-color-status-3 fd-has-margin-top-tiny"
            role="alert"
          >
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
