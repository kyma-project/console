import React from 'react';
import PropTypes from 'prop-types';

import { FileInput, Modal } from 'react-shared';
import { Button } from 'fundamental-react';
import { useNotification } from 'react-shared';
import { parseFile } from './deployResourceHelpers';
import { useMutation } from 'react-apollo';
import { CREATE_RESOURCE } from 'gql/mutations';

DeployResourceModal.propTypes = { namespace: PropTypes.string.isRequired };

export default function DeployResourceModal({ namespace }) {
  const [createResource] = useMutation(CREATE_RESOURCE);

  const notification = useNotification();
  const [error, setError] = React.useState(null);
  const [contents, setContents] = React.useState(null);

  const fileInputChanged = async file => {
    const [content, error] = await parseFile(file);
    setContents(content);
    setError(error);
  };

  const deployResource = async () => {
    const promises = contents.map(content => {
      // add "metadata.namespace", as it's required for RBAC
      if (!content.metadata.namespace) {
        content.metadata.namespace = namespace;
      }

      return createResource({
        variables: {
          namespace: namespace,
          resource: content,
        },
      });
    });

    const results = await Promise.allSettled(promises);
    const succeeded = results.filter(r => r.status === 'fulfilled');

    if (results.length === succeeded.length) {
      notification.notifySuccess({
        content: 'Successfully deployed new resource(s)',
      });
    } else {
      const failedCount = results.length - succeeded.length;
      const firstError = results.filter(r => r.status !== 'fulfilled')[0]
        .reason;
      notification.notifyError(
        {
          content: `Could not deploy resources: (${failedCount}/${results.length} failed). ${firstError}`,
        },
        15000,
      );
    }
  };

  const modalOpeningComponent = (
    <Button className="fd-has-margin-left-tiny" glyph="add">
      Deploy new resource
    </Button>
  );

  return (
    <Modal
      title="Deploy new resource"
      modalOpeningComponent={modalOpeningComponent}
      confirmText="Deploy"
      cancelText="Cancel"
      onConfirm={deployResource}
      disabledConfirm={!contents || !!error}
      onShow={() => setContents(null) || setError(null)}
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
